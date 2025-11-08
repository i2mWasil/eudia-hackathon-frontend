/**
 * Service for company-related API calls
 */

import { getServerUrl } from "@/lib/api-client"
import type { CompaniesResponse, Company, CompanyApiResponse } from "@/types/company"
import { loadDomainList, formatDomainToName, generateLogoUrl } from "@/lib/folderlist-loader"
import { getCachedCompany, cacheCompany } from "@/lib/company-cache"

/**
 * Fetches EULA data for a specific domain with timeout
 * @param domain - The domain to query (e.g., "apple.com")
 * @param timeoutMs - Timeout in milliseconds (default 20 seconds)
 * @returns Promise with company API response
 */
async function fetchDomainData(domain: string, timeoutMs: number = 20000): Promise<CompanyApiResponse> {
  try {
    const serverUrl = getServerUrl()
    const endpoint = `${serverUrl}/context/eula/latest?domain=${encodeURIComponent(domain)}`
    
    // Create an abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeoutMs}ms`)
      }
      throw error
    }
  } catch (error) {
    console.error(`Error fetching data for domain ${domain}:`, error)
    throw error
  }
}

/**
 * Transforms API response to Company object
 * @param domain - The domain name
 * @param apiResponse - The API response data
 * @returns Company object
 */
function transformToCompany(domain: string, apiResponse: CompanyApiResponse): Company {
  const importantPoints = [
    apiResponse.important_point_1,
    apiResponse.important_point_2,
    apiResponse.important_point_3,
  ].filter(point => point !== undefined) as any[]

  return {
    id: domain,
    domain: domain,
    name: formatDomainToName(domain),
    logoUrl: generateLogoUrl(domain),
    description: apiResponse.oneline_desc,
    metrics: [
      { name: "privacy", score: parseInt(apiResponse.privacy_rating_100) },
      { name: "data", score: parseInt(apiResponse.data_rating_100) },
      { name: "clarity", score: parseInt(apiResponse.clarity_rating_100) },
    ],
    overallScore: parseInt(apiResponse.overall_rating_100),
    importantPoints: importantPoints,
  }
}

/**
 * Fetches companies from the API based on domain list with progressive loading and caching
 * @param searchQuery Optional search query to filter companies by name/domain
 * @param offset Starting index for pagination
 * @param limit Number of companies to fetch
 * @param onProgressUpdate Callback for progressive updates as companies load
 * @returns Promise with companies data
 */
export async function fetchCompanies(
  searchQuery?: string,
  offset: number = 0,
  limit: number = 6,
  onProgressUpdate?: (company: Company) => void
): Promise<CompaniesResponse> {
  try {
    // Load domain list from folderlist.csv
    const domains = await loadDomainList()
    
    // Filter domains based on search query if provided
    const filteredDomains = searchQuery
      ? domains.filter(domain => 
          domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
          formatDomainToName(domain).toLowerCase().includes(searchQuery.toLowerCase())
        )
      : domains

    // Get the slice of domains for this page - fetch extra to account for failures
    const bufferSize = limit * 3 // Fetch 3x to handle failures
    const maxDomainsToTry = Math.min(offset + bufferSize, filteredDomains.length)
    const domainsToTry = filteredDomains.slice(offset, maxDomainsToTry)
    
    if (domainsToTry.length === 0) {
      return {
        companies: [],
        total: filteredDomains.length,
      }
    }

    // Check cache first and separate cached vs non-cached
    const cachedCompanies: Company[] = []
    const domainsToFetchFromApi: string[] = []
    
    for (const domain of domainsToTry) {
      const cached = getCachedCompany(domain)
      if (cached) {
        cachedCompanies.push(cached)
        // Immediately notify about cached company
        if (onProgressUpdate) {
          onProgressUpdate(cached)
        }
      } else {
        domainsToFetchFromApi.push(domain)
      }
      
      // Stop if we already have enough from cache
      if (cachedCompanies.length >= limit) {
        break
      }
    }

    // If we have enough from cache, return early
    if (cachedCompanies.length >= limit) {
      return {
        companies: cachedCompanies.slice(0, limit),
        total: filteredDomains.length,
      }
    }

    // Fetch non-cached domains progressively until we get enough successful responses
    const fetchedCompanies: Company[] = []
    const remainingNeeded = limit - cachedCompanies.length
    
    // Process domains one by one until we have enough
    for (const domain of domainsToFetchFromApi) {
      if (fetchedCompanies.length >= remainingNeeded) {
        break
      }
      
      try {
        const apiResponse = await fetchDomainData(domain, 20000) // 20 second timeout
        const company = transformToCompany(domain, apiResponse)
        
        // Cache the result
        cacheCompany(company)
        
        // Add to fetched list
        fetchedCompanies.push(company)
        
        // Immediately notify about the new company
        if (onProgressUpdate) {
          onProgressUpdate(company)
        }
      } catch (error) {
        console.warn(`Skipping domain ${domain} due to error:`, error)
        // Continue to next domain
        continue
      }
    }

    // Combine cached and fetched companies
    const allCompanies = [...cachedCompanies, ...fetchedCompanies]

    return {
      companies: allCompanies.slice(0, limit), // Ensure we don't return more than limit
      total: filteredDomains.length,
    }
  } catch (error) {
    console.error("Error fetching companies:", error)
    throw error
  }
}

/**
 * Fetches a single company by domain
 * @param domain Company domain (e.g., "apple.com")
 * @returns Promise with company data
 */
export async function fetchCompanyByDomain(domain: string): Promise<Company> {
  try {
    const apiResponse = await fetchDomainData(domain)
    return transformToCompany(domain, apiResponse)
  } catch (error) {
    console.error(`Error fetching company ${domain}:`, error)
    throw error
  }
}

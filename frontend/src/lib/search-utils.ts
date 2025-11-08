/**
 * Search utilities for company/domain autocomplete
 */

let cachedDomains: string[] | null = null

/**
 * Load domains from the CSV file
 */
export async function loadDomainsList(): Promise<string[]> {
  if (cachedDomains) {
    return cachedDomains
  }

  try {
    const response = await fetch('/src/cache/folderlist.csv')
    const text = await response.text()
    
    // Parse CSV and filter out empty lines
    const domains = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
    
    cachedDomains = domains
    return domains
  } catch (error) {
    console.error('Failed to load domains list:', error)
    return []
  }
}

/**
 * Format domain to company name
 */
export function formatDomainToCompanyName(domain: string): string {
  // Remove TLD (.com, .org, etc.)
  const name = domain.split('.')[0]
  
  // Capitalize first letter
  return name.charAt(0).toUpperCase() + name.slice(1)
}

/**
 * Search domains by query
 */
export function searchDomains(domains: string[], query: string, limit: number = 10): string[] {
  if (!query || query.trim().length === 0) {
    return []
  }

  const lowerQuery = query.toLowerCase().trim()
  
  // Filter domains that match the query
  const matches = domains.filter(domain => {
    const domainLower = domain.toLowerCase()
    const companyName = formatDomainToCompanyName(domain).toLowerCase()
    
    // Match if domain or company name starts with or contains the query
    return domainLower.includes(lowerQuery) || companyName.includes(lowerQuery)
  })
  
  // Sort results: exact matches first, then starts-with, then contains
  const sorted = matches.sort((a, b) => {
    const aLower = a.toLowerCase()
    const bLower = b.toLowerCase()
    const aName = formatDomainToCompanyName(a).toLowerCase()
    const bName = formatDomainToCompanyName(b).toLowerCase()
    
    // Exact match with domain
    if (aLower === lowerQuery) return -1
    if (bLower === lowerQuery) return 1
    
    // Exact match with company name
    if (aName === lowerQuery) return -1
    if (bName === lowerQuery) return 1
    
    // Starts with (domain)
    if (aLower.startsWith(lowerQuery) && !bLower.startsWith(lowerQuery)) return -1
    if (bLower.startsWith(lowerQuery) && !aLower.startsWith(lowerQuery)) return 1
    
    // Starts with (company name)
    if (aName.startsWith(lowerQuery) && !bName.startsWith(lowerQuery)) return -1
    if (bName.startsWith(lowerQuery) && !aName.startsWith(lowerQuery)) return 1
    
    // Alphabetical for the rest
    return a.localeCompare(b)
  })
  
  return sorted.slice(0, limit)
}

/**
 * Browser cache utility for storing company data
 */

import type { Company } from "@/types/company"

const CACHE_KEY_PREFIX = "company_cache_"
const CACHE_INDEX_KEY = "company_cache_index"
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours

interface CacheEntry {
  company: Company
  timestamp: number
}

interface CacheIndex {
  domains: string[]
  timestamp: number
}

/**
 * Get cached company by domain
 */
export function getCachedCompany(domain: string): Company | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY_PREFIX + domain)
    if (!cached) return null

    const entry: CacheEntry = JSON.parse(cached)
    
    // Check if cache is expired
    if (Date.now() - entry.timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(CACHE_KEY_PREFIX + domain)
      return null
    }

    return entry.company
  } catch (error) {
    console.error(`Error reading cache for ${domain}:`, error)
    return null
  }
}

/**
 * Cache a company
 */
export function cacheCompany(company: Company): void {
  try {
    const entry: CacheEntry = {
      company,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_KEY_PREFIX + company.domain, JSON.stringify(entry))
    
    // Update cache index
    updateCacheIndex(company.domain)
  } catch (error) {
    console.error(`Error caching company ${company.domain}:`, error)
  }
}

/**
 * Get all cached companies for given domains
 */
export function getCachedCompanies(domains: string[]): Company[] {
  const companies: Company[] = []
  
  for (const domain of domains) {
    const cached = getCachedCompany(domain)
    if (cached) {
      companies.push(cached)
    }
  }
  
  return companies
}

/**
 * Update the cache index with a new domain
 */
function updateCacheIndex(domain: string): void {
  try {
    const indexStr = localStorage.getItem(CACHE_INDEX_KEY)
    let index: CacheIndex
    
    if (indexStr) {
      index = JSON.parse(indexStr)
      if (!index.domains.includes(domain)) {
        index.domains.push(domain)
        index.timestamp = Date.now()
      }
    } else {
      index = {
        domains: [domain],
        timestamp: Date.now(),
      }
    }
    
    localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index))
  } catch (error) {
    console.error("Error updating cache index:", error)
  }
}

/**
 * Clear expired cache entries
 */
export function clearExpiredCache(): void {
  try {
    const indexStr = localStorage.getItem(CACHE_INDEX_KEY)
    if (!indexStr) return
    
    const index: CacheIndex = JSON.parse(indexStr)
    const validDomains: string[] = []
    
    for (const domain of index.domains) {
      const cached = localStorage.getItem(CACHE_KEY_PREFIX + domain)
      if (cached) {
        const entry: CacheEntry = JSON.parse(cached)
        if (Date.now() - entry.timestamp <= CACHE_EXPIRY_MS) {
          validDomains.push(domain)
        } else {
          localStorage.removeItem(CACHE_KEY_PREFIX + domain)
        }
      }
    }
    
    if (validDomains.length !== index.domains.length) {
      index.domains = validDomains
      index.timestamp = Date.now()
      localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index))
    }
  } catch (error) {
    console.error("Error clearing expired cache:", error)
  }
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
  try {
    const indexStr = localStorage.getItem(CACHE_INDEX_KEY)
    if (indexStr) {
      const index: CacheIndex = JSON.parse(indexStr)
      for (const domain of index.domains) {
        localStorage.removeItem(CACHE_KEY_PREFIX + domain)
      }
      localStorage.removeItem(CACHE_INDEX_KEY)
    }
  } catch (error) {
    console.error("Error clearing cache:", error)
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { count: number; size: number } {
  try {
    const indexStr = localStorage.getItem(CACHE_INDEX_KEY)
    if (!indexStr) return { count: 0, size: 0 }
    
    const index: CacheIndex = JSON.parse(indexStr)
    let totalSize = 0
    
    for (const domain of index.domains) {
      const cached = localStorage.getItem(CACHE_KEY_PREFIX + domain)
      if (cached) {
        totalSize += cached.length
      }
    }
    
    return {
      count: index.domains.length,
      size: totalSize,
    }
  } catch (error) {
    console.error("Error getting cache stats:", error)
    return { count: 0, size: 0 }
  }
}

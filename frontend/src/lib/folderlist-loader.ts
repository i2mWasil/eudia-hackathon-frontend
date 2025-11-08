/**
 * Utility to load and parse the folderlist.csv containing domain names
 */

/**
 * Loads the folderlist.csv and returns an array of domain names
 * @returns Promise with array of domain names
 */
export async function loadDomainList(): Promise<string[]> {
  try {
    // Import the CSV file as raw text from src/cache directory
    const response = await fetch('/src/cache/folderlist.csv')
    if (!response.ok) {
      throw new Error(`Failed to load domain list: ${response.statusText}`)
    }
    const text = await response.text()
    
    // Parse CSV - each line is a domain name
    const domains = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => {
        // Filter out empty lines and non-domain entries (numbers, file extensions)
        if (!line) return false
        if (line.match(/^\d+$/)) return false // Pure numbers
        if (line.match(/\.(txt|csv)$/)) return false // File names
        if (line === 'LICENSE' || line === 'README.md') return false
        return true
      })
    
    return domains
  } catch (error) {
    console.error('Error loading domain list:', error)
    throw error
  }
}

/**
 * Formats a domain name into a display name
 * @param domain - The domain name (e.g., "apple.com")
 * @returns Formatted name (e.g., "Apple")
 */
export function formatDomainToName(domain: string): string {
  // Remove common TLDs and clean up
  const name = domain
    .replace(/\.(com|org|net|io|co|ai|eu|fr|uk|de|ru|dz)$/i, '')
    .replace(/[._-]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  return name
}

/**
 * Generates a logo URL for a domain using a placeholder or logo service
 * @param domain - The domain name
 * @returns Logo URL
 */
export function generateLogoUrl(domain: string): string {
  // Using Clearbit Logo API (free tier available)
  // Alternative: return `https://logo.clearbit.com/${domain}`
  
  // For now, using a simple placeholder with the domain name
  const name = formatDomainToName(domain)
  const color = generateColorFromDomain(domain)
  return `https://via.placeholder.com/400x100/${color}/FFFFFF?text=${encodeURIComponent(name)}`
}

/**
 * Generates a consistent color hash from a domain name
 * @param domain - The domain name
 * @returns Hex color code without #
 */
function generateColorFromDomain(domain: string): string {
  let hash = 0
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const color = Math.abs(hash).toString(16).substring(0, 6).padEnd(6, '0')
  return color
}

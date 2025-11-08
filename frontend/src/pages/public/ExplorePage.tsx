import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { CompanyCard } from "@/components/cards/CompanyCard"
import { fetchCompanies } from "@/lib/services/company-service"
import { clearExpiredCache } from "@/lib/company-cache"
import type { Company } from "@/types/company"

export function ExplorePage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingCount, setLoadingCount] = useState(0)
  
  // Clear expired cache on mount
  useEffect(() => {
    clearExpiredCache()
  }, [])

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch companies when debounced search query changes
  const loadCompanies = useCallback(async (reset: boolean = false) => {
    setError(null)
    
    if (reset) {
      setIsLoading(true)
      setHasMore(true)
      setCompanies([]) // Clear companies when resetting
      setLoadingCount(0)
      
      try {
        // Progressive update callback
        const handleProgressUpdate = (company: Company) => {
          setCompanies(prev => {
            // Avoid duplicates
            if (prev.some(c => c.id === company.id)) {
              return prev
            }
            return [...prev, company]
          })
          setLoadingCount(prev => prev + 1)
        }
        
        const data = await fetchCompanies(
          debouncedSearchQuery || undefined, 
          0, 
          6,
          handleProgressUpdate
        )
        
        // Final update to ensure all companies are in correct order
        setCompanies(data.companies)
        // Check if there might be more companies based on total available
        const actualLoaded = data.companies.length
        setHasMore(actualLoaded > 0 && offset + actualLoaded < data.total)
        setOffset(6)
      } catch (err) {
        console.error("Failed to fetch companies:", err)
        setError("Failed to load companies. Using sample data for demonstration.")
        setCompanies(getSampleCompanies())
        setHasMore(false)
      } finally {
        setIsLoading(false)
        setLoadingCount(0)
      }
    } else {
      setIsLoadingMore(true)
      
      try {
        // Progressive update callback
        const handleProgressUpdate = (company: Company) => {
          setCompanies(prev => {
            // Avoid duplicates
            if (prev.some(c => c.id === company.id)) {
              return prev
            }
            return [...prev, company]
          })
          setLoadingCount(prev => prev + 1)
        }
        
        const data = await fetchCompanies(
          debouncedSearchQuery || undefined, 
          offset, 
          6,
          handleProgressUpdate
        )
        
        // Ensure all new companies are added
        setCompanies(prev => {
          const existingIds = new Set(prev.map(c => c.id))
          const newCompanies = data.companies.filter(c => !existingIds.has(c.id))
          return [...prev, ...newCompanies]
        })
        
        // Check if there might be more companies based on total available
        const newOffset = offset + 6
        setHasMore(data.companies.length > 0 && newOffset < data.total)
        setOffset(newOffset)
      } catch (err) {
        console.error("Failed to fetch more companies:", err)
        setHasMore(false)
      } finally {
        setIsLoadingMore(false)
        setLoadingCount(0)
      }
    }
  }, [debouncedSearchQuery, offset, companies.length])

  // Reset and load when search query changes
  useEffect(() => {
    loadCompanies(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery])

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      loadCompanies(false)
    }
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleSearchSubmit = (query: string) => {
    // Force immediate search on submit
    setDebouncedSearchQuery(query)
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header with search bar */}
      <Header 
        showSearch 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl lg:text-5xl font-serif">Explore Services</h1>
            {!isLoading && (
              <p className="text-muted-foreground">
                {companies.length} {companies.length === 1 ? 'service' : 'services'} found
              </p>
            )}
          </div>
          
          {/* Loading State */}
          {isLoading && companies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading services...</p>
            </div>
          )}
          
          {/* Progressive Loading State - Show cards as they load */}
          {isLoading && companies.length > 0 && (
            <div className="mb-4 flex items-center justify-center">
              <div className="bg-primary/10 rounded-lg px-4 py-2 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-primary">
                  Loading... ({loadingCount} loaded)
                </span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
              <p className="text-destructive font-medium mb-2">Error Loading Companies</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <p className="text-sm text-muted-foreground mt-2">Showing sample data for demonstration.</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && companies.length === 0 && (
            <div className="text-center py-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 mx-auto mb-4 text-muted-foreground"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <h2 className="text-2xl font-serif mb-2">No services found</h2>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `No services match "${searchQuery}". Try a different search term.`
                  : "No services available at the moment."
                }
              </p>
            </div>
          )}

          {/* Company Cards Grid */}
          {companies.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {companies.map((company, index) => (
                  <div 
                    key={company.id}
                    className="animate-fadeIn"
                    style={{
                      animationDelay: `${(index % 6) * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <CompanyCard company={company} />
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              {!isLoading && (
                <div className="flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore || !hasMore}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        Loading more... ({loadingCount} loaded)
                      </>
                    ) : hasMore ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                          />
                        </svg>
                        Load More (6 more)
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                        All loaded
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

// Sample data fallback for development/error scenarios
function getSampleCompanies(): Company[] {
  return [
    {
      id: "1",
      domain: "twitter.com",
      name: "Twitter",
      logoUrl: "https://via.placeholder.com/400x100/1DA1F2/FFFFFF?text=Twitter",
      description: "Social media platform for sharing thoughts and updates",
      metrics: [
        { name: "privacy", score: 65 },
        { name: "data", score: 72 },
        { name: "clarity", score: 58 },
      ],
      overallScore: 65,
    },
    {
      id: "2",
      domain: "facebook.com",
      name: "Facebook",
      logoUrl: "https://via.placeholder.com/400x100/1877F2/FFFFFF?text=Facebook",
      description: "Social networking service for connecting with friends and family",
      metrics: [
        { name: "privacy", score: 45 },
        { name: "data", score: 52 },
        { name: "clarity", score: 48 },
      ],
      overallScore: 48,
    },
    {
      id: "3",
      domain: "reddit.com",
      name: "Reddit",
      logoUrl: "https://via.placeholder.com/400x100/FF4500/FFFFFF?text=Reddit",
      description: "Community-driven content aggregation and discussion platform",
      metrics: [
        { name: "privacy", score: 78 },
        { name: "data", score: 85 },
        { name: "clarity", score: 82 },
      ],
      overallScore: 82,
    },
    {
      id: "4",
      domain: "instagram.com",
      name: "Instagram",
      logoUrl: "https://via.placeholder.com/400x100/E4405F/FFFFFF?text=Instagram",
      description: "Photo and video sharing social networking service",
      metrics: [
        { name: "privacy", score: 50 },
        { name: "data", score: 55 },
        { name: "clarity", score: 52 },
      ],
      overallScore: 52,
    },
    {
      id: "5",
      domain: "linkedin.com",
      name: "LinkedIn",
      logoUrl: "https://via.placeholder.com/400x100/0A66C2/FFFFFF?text=LinkedIn",
      description: "Professional networking platform for career development",
      metrics: [
        { name: "privacy", score: 88 },
        { name: "data", score: 91 },
        { name: "clarity", score: 86 },
      ],
      overallScore: 88,
    },
    {
      id: "6",
      domain: "tiktok.com",
      name: "TikTok",
      logoUrl: "https://via.placeholder.com/400x100/000000/FFFFFF?text=TikTok",
      description: "Short-form video sharing platform",
      metrics: [
        { name: "privacy", score: 35 },
        { name: "data", score: 42 },
        { name: "clarity", score: 38 },
      ],
      overallScore: 38,
    },
  ]
}

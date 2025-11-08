import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Footer } from "@/components/layout/Footer"
import { EulaComparison } from "@/components/comparison/EulaComparison"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/ThemeContext"

export function ComparisonPage() {
  const { domain1, domain2 } = useParams<{ domain1?: string; domain2?: string }>()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [comparisonContent, setComparisonContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchComparison = async () => {
      if (!domain1 || !domain2) {
        setError("Two domains are required for comparison")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const API_BASE_URL = "https://bs7x3fr9-8000.inc1.devtunnels.ms"
        const url = `${API_BASE_URL}/context/eula/compare?domain1=${encodeURIComponent(domain1)}&domain2=${encodeURIComponent(domain2)}`
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch comparison: ${response.statusText}`)
        }

        const data = await response.text()
        setComparisonContent(data)
      } catch (err) {
        console.error("Error fetching EULA comparison:", err)
        setError(err instanceof Error ? err.message : "Failed to load comparison")
      } finally {
        setIsLoading(false)
      }
    }

    fetchComparison()
  }, [domain1, domain2])

  const handleBack = () => {
    navigate(-1)
  }

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif text-foreground">EULA Comparison</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {domain1 && domain2 ? `${domain1} vs ${domain2}` : "Compare End User License Agreements"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleBack}
                variant="outline"
                size="sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
                Back
              </Button>
              <Button 
                onClick={handleReload}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                {isLoading ? 'Loading...' : 'Reload'}
              </Button>
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="sm"
              >
                {theme === 'dark' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                    />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading comparison...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 mx-auto mb-4 text-destructive"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            <p className="text-destructive font-medium mb-2">Error Loading Comparison</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={handleReload} className="mt-4" variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Comparison Content */}
        {!isLoading && !error && comparisonContent && (
          <EulaComparison content={comparisonContent} />
        )}

        {/* Empty State */}
        {!isLoading && !error && !comparisonContent && (
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
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            <h2 className="text-2xl font-serif mb-2">No Comparison Data</h2>
            <p className="text-muted-foreground">
              Please provide two domains to compare their EULAs.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

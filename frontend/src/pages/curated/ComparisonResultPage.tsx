import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Footer } from "@/components/layout/Footer"
import { EulaComparison } from "@/components/comparison/EulaComparison"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/ThemeContext"

interface LocationState {
  domain: string
  version1: string
  version2: string
  comparisonContent: string
  documentType?: string
}

export function ComparisonResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    // Redirect if no state is provided
    if (!state || !state.comparisonContent) {
      navigate('/compare-domain')
    }
  }, [state, navigate])

  if (!state) {
    return null
  }

  const handleBack = () => {
    navigate('/compare-domain')
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
              <h1 className="text-2xl font-serif text-foreground">{state.documentType || 'EULA'} Version Comparison</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {state.domain}: <span className="font-semibold">{state.version1}</span> vs <span className="font-semibold">{state.version2}</span>
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
                New Comparison
              </Button>
              <Button 
                onClick={handleReload}
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
                Reload
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
        <EulaComparison content={state.comparisonContent} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { extractMarkdownFromResponse } from "@/lib/markdown-sanitizer"

interface LocationState {
  domain: string
  versions: string[]
  documentType?: string
}

export function CompareSelectPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null
  
  const [version1, setVersion1] = useState("")
  const [version2, setVersion2] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Debug logging
    console.log("CompareSelectPage - Location state:", state)
    console.log("CompareSelectPage - Domain:", state?.domain)
    console.log("CompareSelectPage - Versions:", state?.versions)
    
    // Redirect if no state is provided
    if (!state || !state.domain || !state.versions || state.versions.length === 0) {
      console.log("CompareSelectPage - Redirecting to /compare-domain due to missing state")
      navigate('/compare-domain')
    }
  }, [state, navigate])

  if (!state) {
    console.log("CompareSelectPage - No state, returning null")
    return null
  }

  const handleCompare = async () => {
    setError("")
    
    // Validate inputs
    if (!version1 || !version2) {
      setError("Please select both versions to compare")
      return
    }

    if (version1 === version2) {
      setError("Please select two different versions")
      return
    }

    setIsLoading(true)

    try {
      const API_BASE_URL = "https://bs7x3fr9-8000.inc1.devtunnels.ms"
      const response = await fetch(
        `${API_BASE_URL}/services/compare?domain=${encodeURIComponent(state.domain)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            version1: version1,
            version2: version2,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to compare versions: ${response.status} ${response.statusText}`)
      }

      const comparisonResult = await response.json()
      
      console.log("CompareSelect - API Response:", comparisonResult)
      
      // Extract and sanitize the markdown content from the response
      const markdownContent = extractMarkdownFromResponse(comparisonResult)
      
      console.log("CompareSelect - Sanitized markdown content:", markdownContent.substring(0, 200) + "...")
      
      // Navigate to comparison page with the result
      navigate('/comparison-result', { 
        state: { 
          domain: state.domain,
          version1,
          version2,
          documentType: state.documentType,
          comparisonContent: markdownContent
        } 
      })
    } catch (err) {
      console.error("Error comparing versions:", err)
      setError(err instanceof Error ? err.message : "Failed to compare versions")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-serif mb-4">Select Versions to Compare</h1>
            <p className="text-muted-foreground text-lg">
              Comparing {state.documentType || 'EULA'} for: <span className="font-semibold">{state.domain}</span>
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              {state.versions.length} version{state.versions.length !== 1 ? 's' : ''} available
            </p>
          </div>

          <div className="bg-card border rounded-lg p-8 space-y-6">
            {/* Version 1 Selection */}
            <div className="space-y-2">
              <Label htmlFor="version1" className="text-base">First Version</Label>
              <select
                id="version1"
                value={version1}
                onChange={(e) => setVersion1(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border bg-background text-foreground text-base"
                disabled={isLoading}
              >
                <option value="">Select a version...</option>
                {state.versions.map((version, index) => (
                  <option key={index} value={version}>
                    {version}
                  </option>
                ))}
              </select>
            </div>

            {/* VS Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 border-t"></div>
              <span className="text-2xl font-bold text-muted-foreground">VS</span>
              <div className="flex-1 border-t"></div>
            </div>

            {/* Version 2 Selection */}
            <div className="space-y-2">
              <Label htmlFor="version2" className="text-base">Second Version</Label>
              <select
                id="version2"
                value={version2}
                onChange={(e) => setVersion2(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border bg-background text-foreground text-base"
                disabled={isLoading}
              >
                <option value="">Select a version...</option>
                {state.versions.map((version, index) => (
                  <option key={index} value={version}>
                    {version}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {/* Compare Button */}
            <Button
              onClick={handleCompare}
              className="w-full text-lg py-6"
              size="lg"
              disabled={isLoading || !version1 || !version2}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Comparing Versions...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                    />
                  </svg>
                  Compare Versions
                </>
              )}
            </Button>
          </div>

          {/* Back Button */}
          <div className="text-center mt-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/compare-domain')}
              disabled={isLoading}
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
              Try Different Domain
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

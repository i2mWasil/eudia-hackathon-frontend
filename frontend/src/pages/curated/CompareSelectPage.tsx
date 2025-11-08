import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                />
              </svg>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Select Versions to Compare
            </h1>
            <p className="text-muted-foreground text-lg">
              Comparing {state.documentType || 'EULA'} for: <span className="font-semibold text-foreground">{state.domain}</span>
            </p>
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-muted/50 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <span className="text-sm text-muted-foreground">
                {state.versions.length} version{state.versions.length !== 1 ? 's' : ''} available
              </span>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-8 space-y-6 shadow-sm">
            {/* Version 1 Selection */}
            <div className="space-y-3">
              <Label htmlFor="version1" className="text-base font-medium">
                First Version
              </Label>
              <Select
                id="version1"
                value={version1}
                onChange={(e) => setVersion1(e.target.value)}
                disabled={isLoading}
              >
                <option value="" disabled>
                  Select a version...
                </option>
                {state.versions.map((version, index) => (
                  <option key={index} value={version}>
                    {version}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose the older version to compare from
              </p>
            </div>

            {/* VS Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30"></div>
              <div className="bg-primary/10 px-4 py-2 rounded-full">
                <span className="text-xl font-bold text-primary">VS</span>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30"></div>
            </div>

            {/* Version 2 Selection */}
            <div className="space-y-3">
              <Label htmlFor="version2" className="text-base font-medium">
                Second Version
              </Label>
              <Select
                id="version2"
                value={version2}
                onChange={(e) => setVersion2(e.target.value)}
                disabled={isLoading}
              >
                <option value="" disabled>
                  Select a version...
                </option>
                {state.versions.map((version, index) => (
                  <option key={index} value={version}>
                    {version}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose the newer version to compare to
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border-2 border-destructive/50 rounded-lg p-4 flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
                <div>
                  <p className="text-destructive text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Compare Button */}
            <div className="pt-2">
              <Button
                onClick={handleCompare}
                className="w-full text-lg py-7 shadow-lg hover:shadow-xl transition-all"
                size="lg"
                disabled={isLoading || !version1 || !version2}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    <span>Analyzing Differences...</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6 mr-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                      />
                    </svg>
                    <span>Compare Versions</span>
                  </>
                )}
              </Button>
              {!version1 || !version2 ? (
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Please select both versions to enable comparison
                </p>
              ) : version1 === version2 ? (
                <p className="text-xs text-destructive text-center mt-3">
                  Please select two different versions
                </p>
              ) : (
                <p className="text-xs text-primary text-center mt-3 flex items-center justify-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Ready to compare
                </p>
              )}
            </div>
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

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CompareDomainPage() {
  const navigate = useNavigate()
  const [domain, setDomain] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFetchVersions = async () => {
    setError("")
    
    // Validate input
    if (!domain.trim()) {
      setError("Please enter a domain")
      return
    }

    setIsLoading(true)

    try {
      const API_BASE_URL = "https://bs7x3fr9-8000.inc1.devtunnels.ms"
      const response = await fetch(
        `${API_BASE_URL}/diff/versions?domain=${encodeURIComponent(domain.trim())}`
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch versions: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      console.log("CompareDomainPage - Fetched data:", data)
      
      // Extract versions array from the response
      const versionArray = data.versions || []
      const responseDomain = data.domain || domain.trim()
      const documentType = data.document_type || "EULA"
      
      console.log("CompareDomainPage - Navigating with state:", { 
        domain: responseDomain, 
        versions: versionArray,
        documentType: documentType
      })
      
      // Navigate to version selection page with versions data
      navigate('/compare-select', { 
        state: { 
          domain: responseDomain, 
          versions: versionArray,
          documentType: documentType
        } 
      })
    } catch (err) {
      console.error("Error fetching versions:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch versions")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleFetchVersions()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-serif mb-4">Compare EULA Versions</h1>
            <p className="text-muted-foreground text-lg">
              Enter a company domain to compare different versions of their End User License Agreement
            </p>
          </div>

          <div className="bg-card border rounded-lg p-8 space-y-6">
            {/* Domain Input */}
            <div className="space-y-2">
              <Label htmlFor="domain" className="text-base">Company Domain</Label>
              <Input
                id="domain"
                type="text"
                placeholder="e.g., google.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-base py-6"
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Enter the domain name (without https://)
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {/* Fetch Versions Button */}
            <Button
              onClick={handleFetchVersions}
              className="w-full text-lg py-6"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Fetching Versions...
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
                      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                    />
                  </svg>
                  Get Available Versions
                </>
              )}
            </Button>

            {/* Popular Companies */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">Popular Companies:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDomain("google.com")}
                  disabled={isLoading}
                >
                  Google
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDomain("facebook.com")}
                  disabled={isLoading}
                >
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDomain("twitter.com")}
                  disabled={isLoading}
                >
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDomain("amazon.com")}
                  disabled={isLoading}
                >
                  Amazon
                </Button>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
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
              Go Back
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

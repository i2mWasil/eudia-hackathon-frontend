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
              <p className="text-sm text-muted-foreground mb-4 text-center">Quick Select:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDomain("google.com")}
                  disabled={isLoading}
                  className="hover:bg-primary/10 hover:border-primary/50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDomain("facebook.com")}
                  disabled={isLoading}
                  className="hover:bg-primary/10 hover:border-primary/50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDomain("twitter.com")}
                  disabled={isLoading}
                  className="hover:bg-primary/10 hover:border-primary/50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDomain("amazon.com")}
                  disabled={isLoading}
                  className="hover:bg-primary/10 hover:border-primary/50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                    <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726-1.548.414-3.12.618-4.713.618-3.93 0-7.594-.994-10.99-2.964-.24-.14-.36-.28-.36-.433 0-.097.032-.18.09-.237zm21.912-3.59c-.474-.414-.482-.493-.038-1.334l1.052-1.834c.138-.254.25-.34.436-.34.165 0 .318.095.455.284.12.174.18.39.18.646 0 .31-.12.647-.362 1.017l-.803 1.244c-.226.352-.52.595-.884.726-.234.086-.39.086-.496 0zm.29 2.644c-.046-.272-.034-.408.035-.408.023 0 .058.015.104.045.204.15.438.33.7.543.257.207.438.35.544.424.09.06.188.108.293.143.226.076.4.076.523 0 .138-.09.207-.224.207-.404 0-.116-.06-.248-.18-.395-.195-.24-.524-.586-.988-1.034-.476-.463-.76-.816-.848-1.06-.076-.195-.09-.364-.044-.508.066-.226.24-.404.523-.535.285-.136.604-.203.958-.203.3 0 .562.06.787.184.24.138.36.315.36.533 0 .226-.09.39-.27.493-.136.076-.27.09-.404.045-.09-.03-.165-.09-.226-.178-.075-.105-.135-.15-.18-.135-.06.03-.09.12-.09.27 0 .226.165.466.496.718.346.27.61.523.79.76.196.256.293.524.293.802 0 .39-.165.72-.496.988-.3.24-.688.36-1.155.36-.48 0-.863-.12-1.145-.36-.27-.226-.404-.524-.404-.893z"/>
                  </svg>
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

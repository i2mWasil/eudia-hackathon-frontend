import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"

export function PublicHome() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to Our Platform
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover amazing features and experiences. Sign in to unlock personalized content.
          </p>

          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Feature One</h3>
                <p className="text-muted-foreground">
                  Access to basic features available to everyone
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Feature Two</h3>
                <p className="text-muted-foreground">
                  Explore our public content and resources
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Feature Three</h3>
                <p className="text-muted-foreground">
                  Join our community and stay connected
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

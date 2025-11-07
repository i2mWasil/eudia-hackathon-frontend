import { useAuth } from "@/contexts/AuthContext"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"

export function CuratedHome() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {user?.email?.split("@")[0]}!
            </h2>
            <p className="text-muted-foreground">
              Here's your personalized experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Your Activity</h3>
                <p className="text-muted-foreground mb-4">
                  Track your recent interactions and progress
                </p>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Recommendations
                </h3>
                <p className="text-muted-foreground mb-4">
                  Personalized content just for you
                </p>
                <Button variant="outline" size="sm">
                  Explore
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                <p className="text-muted-foreground mb-4">
                  Frequently used features and shortcuts
                </p>
                <Button variant="outline" size="sm">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Settings</h3>
                <p className="text-muted-foreground mb-4">
                  Manage your account and preferences
                </p>
                <Link to="/profile">
                  <Button variant="outline" size="sm">
                    Go to Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

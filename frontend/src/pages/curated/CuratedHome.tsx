import { useAuth } from "@/contexts/AuthContext"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { useTheme } from "@/contexts/ThemeContext"
import artDarkSvg from "@/assets/art-dark.svg"
import artLightSvg from "@/assets/art-light.svg"
import adidasLogo from "@/assets/scroller/logo-adidas.svg"
import anthropicLogo from "@/assets/scroller/logo-anthropic.svg"
import appleLogo from "@/assets/scroller/logo-apple.svg"
import disneyLogo from "@/assets/scroller/logo-disney.svg"
import indeedLogo from "@/assets/scroller/logo-indeed.svg"
import instagramLogo from "@/assets/scroller/logo-instagram.svg"
import metaLogo from "@/assets/scroller/logo-meta.svg"
import netflixLogo from "@/assets/scroller/logo-netflix.svg"
import nikeLogo from "@/assets/scroller/logo-nike.svg"
import perplexityLogo from "@/assets/scroller/logo-perplexity.svg"
import playstationLogo from "@/assets/scroller/logo-playstation.svg"
import redditLogo from "@/assets/scroller/logo-reddit.svg"
import samsungLogo from "@/assets/scroller/logo-samsung.svg"
import spotifyLogo from "@/assets/scroller/logo-spotify.svg"
import uberLogo from "@/assets/scroller/logo-uber.svg"

const logos = [
  adidasLogo,
  anthropicLogo,
  appleLogo,
  disneyLogo,
  indeedLogo,
  instagramLogo,
  metaLogo,
  netflixLogo,
  nikeLogo,
  perplexityLogo,
  playstationLogo,
  redditLogo,
  samsungLogo,
  spotifyLogo,
  uberLogo,
]

export function CuratedHome() {
  const { user } = useAuth()
  const { theme } = useTheme()

  return (
    <div className="bg-background text-foreground relative">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="relative px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-160px)]">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-7xl font-serif leading-[1.1] text-left">
              Welcome back,<br />
              <span className="text-4xl lg:text-6xl">{user?.email?.split("@")[0]}!</span>
            </h2>
            
            <p className="text-thin text-muted-foreground max-w-lg leading-relaxed pt-4 text-left">
              Your personalized dashboard to track how your data is being <em className="italic">used</em> across the web.
            </p>
            
            {/* Buttons */}
            <div className="flex gap-4 pt-8">
              <Button 
                size="lg" 
                className="px-10 py-6 rounded-lg text-lg"
                asChild
              >
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-10 py-6 rounded-lg text-lg"
                asChild
              >
                <Link to="/profile">Profile</Link>
              </Button>
            </div>
          </div>
          
          {/* Right Illustration */}
          <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center">
            <img 
              src={theme === "dark" ? artDarkSvg : artLightSvg}
              alt="Data usage illustration" 
              className="w-full h-full max-w-md object-contain"
            />
          </div>
        </div>
      </div>

      {/* Infinite Scroller Section */}
      <div className="relative z-10 py-4 scroll-fade-container">
        <div className="flex animate-scroll">
          {/* First set of logos */}
          {logos.map((logo, index) => (
            <div key={`logo-1-${index}`} className="flex-shrink-0 mx-12">
              <img 
                src={logo} 
                alt={`Company logo ${index + 1}`}
                className="h-12 w-auto opacity-40 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {logos.map((logo, index) => (
            <div key={`logo-2-${index}`} className="flex-shrink-0 mx-12">
              <img 
                src={logo} 
                alt={`Company logo ${index + 1}`}
                className="h-12 w-auto opacity-40 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

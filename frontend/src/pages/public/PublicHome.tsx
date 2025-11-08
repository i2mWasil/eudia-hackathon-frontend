import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { InfiniteScroller } from "@/components/layout/InfiniteScroller"
import { useTheme } from "@/contexts/ThemeContext"
import artDarkSvg from "@/assets/art-dark.svg"
import artLightSvg from "@/assets/art-light.svg"

export function PublicHome() {
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
            <h2 className="text-5xl lg:text-7xl font-serif leading-[1.1] max-w-[500px] text-left">
              Know how your data gets <em className="italic">used</em>.
            </h2>
            
            <p className="text-thin text-muted-foreground max-w-lg leading-relaxed pt-4 text-left">
              Most big corporations obscure their intentions with your data behind legal jargon. <span className="font-normal">ProBono</span> keeps you informed about it.
            </p>
            
            {/* Buttons */}
            <div className="flex gap-4 pt-8">
              <Button 
                size="lg" 
                className="px-10 py-6 rounded-lg text-lg"
                asChild
              >
                <Link to="/explore">Explore</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-10 py-6 rounded-lg text-lg"
                asChild
              >
                <Link to="/compare-select">Compare</Link>
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
      <InfiniteScroller />

      {/* Footer */}
      <Footer />
    </div>
  )
}

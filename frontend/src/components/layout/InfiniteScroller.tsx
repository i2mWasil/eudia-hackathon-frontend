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

export function InfiniteScroller() {
  return (
    <div className="relative z-10 py-8 overflow-hidden scroll-fade-container">
      <div className="flex animate-scroll">
        {/* First set of logos */}
        {logos.map((logo, index) => (
          <div key={`logo-1-${index}`} className="flex-shrink-0 mx-8 flex items-center justify-center">
            <img 
              src={logo} 
              alt={`Company logo ${index + 1}`}
              className="h-10 w-auto max-w-[120px] object-contain opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {logos.map((logo, index) => (
          <div key={`logo-2-${index}`} className="flex-shrink-0 mx-8 flex items-center justify-center">
            <img 
              src={logo} 
              alt={`Company logo ${index + 1}`}
              className="h-10 w-auto max-w-[120px] object-contain opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

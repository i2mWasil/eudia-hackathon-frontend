import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { CuratedCompanyCard } from "@/components/cards/CuratedCompanyCard"

export function CuratedExplorePage() {
  const [savedCompanies, setSavedCompanies] = useState<Set<string>>(new Set())

  // Sample company data for demonstration - will be replaced with real data later
  const sampleCompanies = [
    {
      id: "1",
      name: "Twitter",
      logoUrl: "https://via.placeholder.com/400x100/1DA1F2/FFFFFF?text=Twitter",
      metrics: [
        { name: "privacy", score: 65 },
        { name: "history", score: 72 },
        { name: "clarity", score: 58 },
      ],
      overallScore: 65,
    },
    {
      id: "2",
      name: "Facebook",
      logoUrl: "https://via.placeholder.com/400x100/1877F2/FFFFFF?text=Facebook",
      metrics: [
        { name: "privacy", score: 45 },
        { name: "history", score: 52 },
        { name: "clarity", score: 48 },
      ],
      overallScore: 48,
    },
    {
      id: "3",
      name: "Reddit",
      logoUrl: "https://via.placeholder.com/400x100/FF4500/FFFFFF?text=Reddit",
      metrics: [
        { name: "privacy", score: 78 },
        { name: "history", score: 85 },
        { name: "clarity", score: 82 },
      ],
      overallScore: 82,
    },
    {
      id: "4",
      name: "Instagram",
      logoUrl: "https://via.placeholder.com/400x100/E4405F/FFFFFF?text=Instagram",
      metrics: [
        { name: "privacy", score: 50 },
        { name: "history", score: 55 },
        { name: "clarity", score: 52 },
      ],
      overallScore: 52,
    },
    {
      id: "5",
      name: "LinkedIn",
      logoUrl: "https://via.placeholder.com/400x100/0A66C2/FFFFFF?text=LinkedIn",
      metrics: [
        { name: "privacy", score: 88 },
        { name: "history", score: 91 },
        { name: "clarity", score: 86 },
      ],
      overallScore: 88,
    },
    {
      id: "6",
      name: "TikTok",
      logoUrl: "https://via.placeholder.com/400x100/000000/FFFFFF?text=TikTok",
      metrics: [
        { name: "privacy", score: 35 },
        { name: "history", score: 42 },
        { name: "clarity", score: 38 },
      ],
      overallScore: 38,
    },
  ]

  const handleToggleSave = (companyId: string) => {
    setSavedCompanies(prev => {
      const newSet = new Set(prev)
      if (newSet.has(companyId)) {
        newSet.delete(companyId)
      } else {
        newSet.add(companyId)
      }
      return newSet
    })
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header with search bar */}
      <Header showSearch />

      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-serif mb-8">Explore Services</h1>
          
          {/* Company Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleCompanies.map((company) => (
              <CuratedCompanyCard
                key={company.id}
                company={company}
                isSaved={savedCompanies.has(company.id)}
                onToggleSave={() => handleToggleSave(company.id)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

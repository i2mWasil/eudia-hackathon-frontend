import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { DashboardCompanyCard } from "@/components/dashboard/DashboardCompanyCard"
import { CompanyDetailPanel } from "@/components/dashboard/CompanyDetailPanel"
import type { Company } from "@/components/cards/CompanyCard"

export function DashboardPage() {
  // Sample company data - these would be the user's saved companies
  const savedCompanies: Company[] = [
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
  ]

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(
    savedCompanies.length > 0 ? savedCompanies[0] : null
  )

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      {/* Header */}
      <Header title="My Dashboard" />

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {savedCompanies.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-4">
                You haven't added any companies to your dashboard yet.
              </p>
              <p className="text-muted-foreground">
                Visit the Explore page to add companies and track their data usage practices.
              </p>
            </div>
          ) : (
            <div className="flex gap-6 h-[calc(100vh-280px)]">
              {/* Left Panel - Detail View (30%) */}
              <div className="w-[30%] border rounded-lg bg-card overflow-hidden">
                <CompanyDetailPanel company={selectedCompany} />
              </div>

              {/* Right Panel - Company Grid (70%) */}
              <div className="w-[70%] overflow-y-auto p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                  {savedCompanies.map((company) => (
                    <DashboardCompanyCard
                      key={company.id}
                      company={company}
                      isSelected={selectedCompany?.id === company.id}
                      onClick={() => setSelectedCompany(company)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

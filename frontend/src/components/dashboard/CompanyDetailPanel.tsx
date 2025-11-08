import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageWithFallback } from "@/components/figma/ImageWithFallback"
import { Progress } from "@/components/ui/progress"
import { getScoreColor } from "@/lib/score-colors"
import { Bookmark, BookmarkCheck, FileText } from "lucide-react"
import type { Company } from "@/types/company"

interface CompanyDetailPanelProps {
  company: Company | null;
  isSaved?: boolean;
  onToggleSaved?: () => void;
}

export function CompanyDetailPanel({ company, isSaved = false, onToggleSaved }: CompanyDetailPanelProps) {
  const navigate = useNavigate()
  
  if (!company) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <p className="text-lg">Select a company to view details</p>
        </div>
      </div>
    )
  }

  const handleViewSummary = () => {
    navigate(`/summary?domain=${encodeURIComponent(company.domain)}`)
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Company Logo */}
      <Card className="overflow-hidden">
        <div className="relative h-40 bg-gray-100">
          <ImageWithFallback
            src={company.logoUrl}
            alt={`${company.name} logo`}
            className="w-full h-full object-cover"
          />
        </div>
      </Card>

      {/* Company Name */}
      <div>
        <h2 className="text-3xl font-serif font-semibold">{company.name}</h2>
        <p className="text-sm text-muted-foreground mt-1">At-a-glance overview</p>
      </div>

      {/* Overall Score Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Overall Score</span>
          </div>
          <div className="flex items-center justify-center py-4">
            <div 
              className="text-5xl font-bold text-white px-8 py-4 rounded-2xl"
              style={{ backgroundColor: getScoreColor(company.overallScore) }}
            >
              {company.overallScore}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Breakdown */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Metrics Breakdown</h3>
          <div className="space-y-4">
            {company.metrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground capitalize font-medium">
                    {metric.name}
                  </span>
                  <span className="text-foreground font-semibold">{metric.score}/100</span>
                </div>
                <Progress value={metric.score} className="h-2.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {onToggleSaved && (
              <Button
                variant="outline"
                onClick={onToggleSaved}
                className="w-full justify-start gap-2"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    Remove from Dashboard
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Add to Dashboard
                  </>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleViewSummary}
              className="w-full justify-start gap-2"
            >
              <FileText className="h-4 w-4" />
              View Full EULA
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

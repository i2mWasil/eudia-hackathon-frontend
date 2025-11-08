import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getScoreColor } from "@/lib/score-colors"
import type { Company } from "@/types/company"

interface CompanyCardProps {
  company: Company
  isSaved?: boolean
  onToggleSaved?: () => void
}

export function CompanyCard({ company, isSaved, onToggleSaved }: CompanyCardProps) {
  const navigate = useNavigate()

  const handleCompanyClick = () => {
    navigate(`/summary?domain=${encodeURIComponent(company.domain)}`)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Company Name Banner */}
      <div 
        className="relative h-48 overflow-hidden bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
        onClick={handleCompanyClick}
      >
        <div className="text-center">
          <h3 className="text-white text-6xl font-semibold px-4 font-serif">{company.name}</h3>
          <p className="text-white/80 text-sm mt-2 font-sans">Click for more details</p>
        </div>
      </div>
      
      <CardContent className="p-6">
        {/* Metrics */}
        <div className="space-y-4 mb-6">
          {company.metrics.map((metric, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground capitalize">{metric.name}</span>
                <span className="text-foreground">{metric.score}/100</span>
              </div>
              <Progress value={metric.score} className="h-2" />
            </div>
          ))}
        </div>
        
        {/* Overall Score */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span>Overall Score</span>
            <span 
              className="font-bold text-white px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: getScoreColor(company.overallScore) }}
            >
              {company.overallScore}
            </span>
          </div>
          
          {/* Save Button - Only shown if onToggleSaved is provided */}
          {onToggleSaved && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleSaved()
              }}
              className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                isSaved 
                  ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' 
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              {isSaved ? 'Remove from Dashboard' : 'Add to Dashboard'}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

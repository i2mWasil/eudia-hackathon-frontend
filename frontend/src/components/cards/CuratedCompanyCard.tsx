import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getScoreColor } from "@/lib/score-colors"
import type { Company } from "@/types/company"

interface CuratedCompanyCardProps {
  company: Company;
}

export function CuratedCompanyCard({ company }: CuratedCompanyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Company Name Banner */}
      <div className="relative h-48 overflow-hidden bg-black/60 flex items-center justify-center">
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
        </div>
      </CardContent>
    </Card>
  );
}

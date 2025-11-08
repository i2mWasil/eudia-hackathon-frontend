import { Card, CardContent } from "@/components/ui/card"
import { ImageWithFallback } from "@/components/figma/ImageWithFallback"
import { Progress } from "@/components/ui/progress"
import { getScoreColor } from "@/lib/score-colors"

export interface Metric {
  name: string;
  score: number;
}

export interface Company {
  id: string;
  name: string;
  logoUrl: string;
  metrics: Metric[];
  overallScore: number;
}

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Extended Logo Banner with Hover Overlay */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={company.logoUrl}
          alt={`${company.name} logo`}
          className="w-full h-full object-cover"
        />
        {/* Dark overlay with company name on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-white text-6xl font-semibold px-4 font-serif">{company.name}</h3>
            <p className="text-white/80 text-sm mt-2 font-sans">Click for more details</p>
          </div>
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

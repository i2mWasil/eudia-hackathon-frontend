import { Card, CardContent } from "@/components/ui/card"
import { ImageWithFallback } from "@/components/figma/ImageWithFallback"
import { Progress } from "@/components/ui/progress"
import { getScoreColor } from "@/lib/score-colors"
import type { Company } from "@/components/cards/CompanyCard"

interface DashboardCompanyCardProps {
  company: Company;
  isSelected: boolean;
  onClick: () => void;
}

export function DashboardCompanyCard({ company, isSelected, onClick }: DashboardCompanyCardProps) {
  return (
    <Card 
      className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer group ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      {/* Extended Logo Banner with Hover Overlay */}
      <div className="relative h-32 overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={company.logoUrl}
          alt={`${company.name} logo`}
          className="w-full h-full object-cover"
        />
        {/* Dark overlay with company name on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-white text-4xl font-semibold px-4 font-serif">{company.name}</h3>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        {/* Compact Metrics */}
        <div className="space-y-3 mb-4">
          {company.metrics.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground capitalize">{metric.name}</span>
                <span className="text-foreground font-medium">{metric.score}</span>
              </div>
              <Progress value={metric.score} className="h-1.5" />
            </div>
          ))}
        </div>
        
        {/* Overall Score */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm">Overall</span>
            <span 
              className="font-bold text-white px-2.5 py-1 rounded-lg text-sm"
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

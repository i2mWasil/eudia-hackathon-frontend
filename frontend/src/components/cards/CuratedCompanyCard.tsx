import { Card, CardContent } from "@/components/ui/card"
import { ImageWithFallback } from "@/components/figma/ImageWithFallback"
import { Progress } from "@/components/ui/progress"
import { getScoreColor } from "@/lib/score-colors"
import { Button } from "@/components/ui/button"
import { Plus, Check } from "lucide-react"

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

interface CuratedCompanyCardProps {
  company: Company;
  isSaved: boolean;
  onToggleSave: () => void;
}

export function CuratedCompanyCard({ company, isSaved, onToggleSave }: CuratedCompanyCardProps) {
  return (
    <Card className="overflow-visible hover:shadow-lg transition-shadow group relative">
      {/* Save/Add Button */}
      <div className="absolute top-4 right-4 z-20">
        <div className="group/tooltip relative">
          <Button
            size="icon"
            variant="outline"
            className={`rounded-full w-10 h-10 shadow-lg transition-all ${
              isSaved 
                ? "bg-background hover:bg-background/90 border-foreground" 
                : "bg-background/80 backdrop-blur-sm hover:bg-background"
            }`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleSave()
            }}
          >
            {isSaved ? (
              <Check className="h-5 w-5 text-foreground" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
          </Button>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50">
            <div className="bg-popover text-popover-foreground text-sm px-3 py-1.5 rounded-md shadow-md whitespace-nowrap border">
              {isSaved ? "Remove from Dashboard" : "Add to Dashboard"}
            </div>
          </div>
        </div>
      </div>

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

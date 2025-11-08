import { Card, CardContent } from "@/components/ui/card"
import { ImageWithFallback } from "@/components/figma/ImageWithFallback"
import { Progress } from "@/components/ui/progress"

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
  // Generate gradient color from dark red (0) to dark green (100)
  const getScoreColor = (score: number) => {
    // Clamp score between 0 and 100
    const clampedScore = Math.min(Math.max(score, 0), 100);
    
    // Define color stops for the gradient - darker colors for better white text readability
    // 0: dark red, 20: red, 40: orange, 60: yellow-orange, 75: olive green, 85: green, 100: dark green
    let r, g, b;
    
    if (clampedScore <= 20) {
      // Dark red to red (0-20)
      const ratio = clampedScore / 20;
      r = Math.round(120 + (80 * ratio)); // 120 -> 200
      g = Math.round(0 + (0 * ratio)); // 0 -> 0
      b = 0;
    } else if (clampedScore <= 40) {
      // Red to dark orange (20-40)
      const ratio = (clampedScore - 20) / 20;
      r = Math.round(200 + (20 * ratio)); // 200 -> 220
      g = Math.round(0 + (100 * ratio)); // 0 -> 100
      b = 0;
    } else if (clampedScore <= 60) {
      // Dark orange to yellow-orange (40-60)
      const ratio = (clampedScore - 40) / 20;
      r = Math.round(220 - (20 * ratio)); // 220 -> 200
      g = Math.round(100 + (80 * ratio)); // 100 -> 180
      b = 0;
    } else if (clampedScore <= 75) {
      // Yellow-orange to olive green (60-75)
      const ratio = (clampedScore - 60) / 15;
      r = Math.round(200 - (110 * ratio)); // 200 -> 90
      g = Math.round(180 - (20 * ratio)); // 180 -> 160
      b = Math.round(0 + (50 * ratio)); // 0 -> 50
    } else if (clampedScore <= 85) {
      // Olive green to green (75-85)
      const ratio = (clampedScore - 75) / 10;
      r = Math.round(90 - (60 * ratio)); // 90 -> 30
      g = Math.round(160 - (10 * ratio)); // 160 -> 150
      b = Math.round(50 - (10 * ratio)); // 50 -> 40
    } else {
      // Green to dark green (85-100)
      const ratio = (clampedScore - 85) / 15;
      r = Math.round(30 - (30 * ratio)); // 30 -> 0
      g = Math.round(150 - (50 * ratio)); // 150 -> 100
      b = Math.round(40 - (40 * ratio)); // 40 -> 0
    }
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Thin Logo Banner */}
      <div className="h-24 overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={company.logoUrl}
          alt={`${company.name} logo`}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardContent className="p-6">
        {/* Company Name */}
        <h3 className="mb-6 text-center">{company.name}</h3>
        
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

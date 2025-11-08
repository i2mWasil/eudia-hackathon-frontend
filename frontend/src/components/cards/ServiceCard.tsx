import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ServiceCardProps {
  name: string
  description: string
  imageUrl?: string
  rating?: number
  category?: string
}

export function ServiceCard({ 
  name, 
  description, 
  imageUrl, 
  rating, 
  category 
}: ServiceCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden rounded-t-xl">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{name}</CardTitle>
          {rating && (
            <div className="flex items-center gap-1 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-yellow-500"
              >
                <path
                  fillRule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{rating}</span>
            </div>
          )}
        </div>
        {category && (
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground w-fit">
            {category}
          </span>
        )}
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}

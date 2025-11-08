import * as React from "react"
import { cn } from "@/lib/utils"

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallback?: string
}

export function ImageWithFallback({ 
  src, 
  alt, 
  className, 
  fallback,
  ...props 
}: ImageWithFallbackProps) {
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  const handleError = () => {
    setError(true)
    setLoading(false)
  }

  const handleLoad = () => {
    setLoading(false)
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center bg-muted", className)}>
        <span className="text-muted-foreground text-sm">
          {fallback || alt}
        </span>
      </div>
    )
  }

  return (
    <>
      {loading && (
        <div className={cn("flex items-center justify-center bg-muted animate-pulse", className)} />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(loading ? "hidden" : "", className)}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  )
}

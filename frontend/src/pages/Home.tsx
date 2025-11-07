import { useAuth } from "@/contexts/AuthContext"
import { CuratedHome } from "./curated/CuratedHome"
import { PublicHome } from "./public/PublicHome"

export function Home() {
  const { isAuthenticated } = useAuth()

  // Show different experiences based on auth status
  return isAuthenticated ? <CuratedHome /> : <PublicHome />
}

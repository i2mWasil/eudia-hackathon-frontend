import { Routes, Route } from "react-router-dom"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Home } from "@/pages/Home"
import { LoginPage } from "@/pages/auth/LoginPage"
import { SignUpPage } from "@/pages/auth/SignUpPage"
import { Profile } from "@/pages/Profile"
import { ExplorePage } from "@/pages/public/ExplorePage"
import { CuratedExplorePage } from "@/pages/curated/CuratedExplorePage"
import { DashboardPage } from "@/pages/curated/DashboardPage"
import { SummaryPage } from "@/pages/curated/SummaryPage"
import { CompareDomainPage } from "@/pages/curated/CompareDomainPage"
import { CompareSelectPage } from "@/pages/curated/CompareSelectPage"
import { ComparisonResultPage } from "@/pages/curated/ComparisonResultPage"

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Home - Shows PublicHome or CuratedHome based on auth */}
      <Route path="/" element={<Home />} />
      
      {/* Explore Page */}
      <Route path="/explore" element={<ExplorePage />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/explore-curated"
        element={
          <ProtectedRoute>
            <CuratedExplorePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/summary"
        element={<SummaryPage />}
      />
      
      {/* Comparison Routes */}
      <Route
        path="/compare-domain"
        element={<CompareDomainPage />}
      />
      <Route
        path="/compare-select"
        element={<CompareSelectPage />}
      />
      <Route
        path="/comparison-result"
        element={<ComparisonResultPage />}
      />
    </Routes>
  )
}

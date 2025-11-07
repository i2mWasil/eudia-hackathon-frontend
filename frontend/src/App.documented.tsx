/**
 * COMPLETE ROUTER CONFIGURATION
 * 
 * This file contains the main application router setup with authentication.
 * It demonstrates:
 * - Conditional home route based on auth status
 * - Protected routes that require authentication
 * - Public auth routes (login/signup)
 * - Context-based authentication management
 */

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { Home } from "./pages/Home"
import { LoginPage } from "./pages/LoginPage"
import { SignUpPage } from "./pages/SignUpPage"
import { Profile } from "./pages/Profile"
import "./App.css"

/**
 * Main App Component
 * 
 * Router Structure:
 * ================
 * 
 * /               → Home (Smart Component)
 *                   ├─ Not Authenticated → PublicHome
 *                   └─ Authenticated     → CuratedHome
 * 
 * /login          → LoginPage (Public)
 *                   └─ On Success → Navigate to /
 * 
 * /signup         → SignUpPage (Public)
 *                   └─ On Success → Navigate to /login
 * 
 * /profile        → Profile (Protected)
 *                   └─ Not Authenticated → Redirect to /login
 * 
 * Authentication Flow:
 * ===================
 * 1. User signs up at /signup
 * 2. Redirected to /login
 * 3. User logs in → AuthContext updated
 * 4. Redirected to / → Shows CuratedHome
 * 5. Can access /profile (protected)
 * 6. Logout → AuthContext cleared → / shows PublicHome
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 
            HOME ROUTE - Accessible to all
            Shows different content based on authentication status
          */}
          <Route path="/" element={<Home />} />
          
          {/* 
            AUTHENTICATION ROUTES - Public
            Users can access these without being logged in
          */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* 
            PROTECTED ROUTES - Require Authentication
            Wrapped in ProtectedRoute component
            Redirects to /login if not authenticated
          */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          {/* 
            ADD MORE PROTECTED ROUTES HERE
            Example:
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

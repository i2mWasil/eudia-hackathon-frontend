import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Button } from "@/components/ui/button"

export function Header() {
  const { isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="sticky top-4 z-50 px-6 py-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto bg-background/80 backdrop-blur-md border border-border rounded-2xl px-8 py-4 shadow-lg">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-4xl font-serif">ProBono</h1>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-6">
          {/* Auth Links or Logout */}
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Log Out
            </Button>
          ) : (
            <div className="flex gap-8 text-xl items-center">
              <Link to="/login" className="hover:opacity-70 transition-opacity font-sans">
                Login
              </Link>
              <Link to="/signup" className="hover:opacity-70 transition-opacity font-sans">
                Sign up
              </Link>
            </div>
          )}

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            className="w-9 px-0"
          >
            {theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

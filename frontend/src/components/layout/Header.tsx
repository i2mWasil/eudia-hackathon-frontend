import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef } from "react"
import { loadDomainsList, searchDomains, formatDomainToCompanyName } from "@/lib/search-utils"

interface HeaderProps {
  showSearch?: boolean
  title?: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onSearchSubmit?: (query: string) => void
}

export function Header({ 
  showSearch = false, 
  title,
  searchQuery: externalSearchQuery,
  onSearchChange,
  onSearchSubmit
}: HeaderProps) {
  const { isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [internalSearchQuery, setInternalSearchQuery] = useState("")
  const [domains, setDomains] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  
  // Use external search query if provided, otherwise use internal state
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery

  // Load domains list on mount
  useEffect(() => {
    loadDomainsList().then(setDomains)
  }, [])

  // Update suggestions when search query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0 && domains.length > 0) {
      const results = searchDomains(domains, searchQuery, 8)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
    setSelectedSuggestionIndex(-1)
  }, [searchQuery, domains])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery)
    } else {
      console.log("Searching for:", searchQuery)
    }
  }
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (onSearchChange) {
      onSearchChange(value)
    } else {
      setInternalSearchQuery(value)
    }
  }

  const handleSuggestionClick = (domain: string) => {
    const companyName = formatDomainToCompanyName(domain)
    if (onSearchChange) {
      onSearchChange(companyName)
    } else {
      setInternalSearchQuery(companyName)
    }
    setShowSuggestions(false)
    
    // Trigger search with the selected domain/company name
    if (onSearchSubmit) {
      onSearchSubmit(companyName)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
      e.preventDefault()
      handleSuggestionClick(suggestions[selectedSuggestionIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  return (
    <header className="sticky top-4 z-50 px-6 py-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto bg-background/80 backdrop-blur-md border border-border rounded-2xl px-8 py-4 shadow-lg">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-4xl font-serif">ProBono</h1>
        </Link>

        {/* Page Title - shown when title prop is provided */}
        {title && (
          <div className="flex-1 mx-8">
            <h2 className="text-5xl font-bold font-serif">{title}</h2>
          </div>
        )}

        {/* Search Bar - Only shown when showSearch is true */}
        {showSearch && (
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative" ref={searchRef}>
              <Input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true)
                  }
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg"
                autoComplete="off"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>

              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50">
                  {suggestions.map((domain, index) => {
                    const companyName = formatDomainToCompanyName(domain)
                    const isSelected = index === selectedSuggestionIndex
                    
                    return (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => handleSuggestionClick(domain)}
                        className={`w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3 ${
                          isSelected ? 'bg-accent' : ''
                        }`}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {companyName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{companyName}</div>
                          <div className="text-xs text-muted-foreground truncate">{domain}</div>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 text-muted-foreground flex-shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                          />
                        </svg>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </form>
        )}

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

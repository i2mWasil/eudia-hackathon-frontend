import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"

interface User {
  email: string
  id?: string
  token: string
  tokenType?: string  // Bearer, JWT, etc.
}

interface AuthContextType {
  user: User | null
  login: (email: string, token: string, userId?: string, tokenType?: string) => void
  logout: () => void
  isAuthenticated: boolean
  getAuthHeader: () => string  // Helper to get "Bearer <token>" format
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken")
    const storedEmail = localStorage.getItem("userEmail")
    const storedUserId = localStorage.getItem("userId")
    const storedTokenType = localStorage.getItem("tokenType")

    if (storedToken && storedEmail) {
      setUser({
        email: storedEmail,
        token: storedToken,
        id: storedUserId || undefined,
        tokenType: storedTokenType || "bearer",
      })
    }
  }, [])

  const login = (email: string, token: string, userId?: string, tokenType: string = "bearer") => {
    const newUser: User = { email, token, id: userId, tokenType }
    setUser(newUser)
    
    // Persist to localStorage
    localStorage.setItem("authToken", token)
    localStorage.setItem("userEmail", email)
    localStorage.setItem("tokenType", tokenType.toLowerCase())
    if (userId) {
      localStorage.setItem("userId", userId)
    }
  }

  const logout = () => {
    setUser(null)
    
    // Clear localStorage
    localStorage.removeItem("authToken")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userId")
    localStorage.removeItem("tokenType")
  }

  const isAuthenticated = !!user

  // Helper function to get formatted Authorization header
  const getAuthHeader = () => {
    if (!user || !user.token) return ""
    const tokenType = user.tokenType || "bearer"
    return `${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} ${user.token}`
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

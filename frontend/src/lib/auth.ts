/**
 * Authentication API utilities
 */

/**
 * Gets the server URL from environment variables
 */
function getServerUrl(): string {
  return import.meta.env.VITE_SERVER_URL || ""
}

export interface RegisterCredentials {
  email: string
  password: string
}

export interface RegisterResponse {
  success: boolean
  message?: string
  error?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message?: string
  error?: string
  token?: string
  access_token?: string  // JWT access token from backend
  token_type?: string    // Usually "bearer" for JWT
  user?: {
    email: string
    id?: string
  }
}

export interface CurrentUser {
  email: string
  id: string
  created_at?: string
  [key: string]: any  // Allow additional fields from backend
}

export interface GetCurrentUserResponse {
  success: boolean
  user?: CurrentUser
  error?: string
}

/**
 * Registers a new user
 */
export async function registerUser(
  credentials: RegisterCredentials
): Promise<RegisterResponse> {
  const serverUrl = getServerUrl()

  if (!serverUrl) {
    return {
      success: false,
      error: "Server URL is not configured",
    }
  }

  try {
    // Create form-urlencoded data as required by backend
    const formData = new URLSearchParams()
    formData.append('email', credentials.email)
    formData.append('password', credentials.password)

    const response = await fetch(`${serverUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    // Check content type to determine how to parse response
    const contentType = response.headers.get("content-type")
    
    // Backend returns 201 on success
    if (response.status === 201) {
      // Try to parse as JSON first, fall back to text
      try {
        const data = await response.json()
        
        // Check if user already exists
        if (data.exists === false) {
          return {
            success: false,
            error: "Account already exists. Please log in instead.",
          }
        }
        
        return {
          success: true,
          message: data.message || "Account created successfully",
        }
      } catch {
        const message = await response.text()
        return {
          success: true,
          message: message || "Account created successfully",
        }
      }
    }

    // Handle error responses
    try {
      const data = await response.json()
      
      // Check if user already exists (alternative check)
      if (data.exists === false) {
        return {
          success: false,
          error: "Account already exists. Please log in instead.",
        }
      }
      
      // Handle 422 validation errors
      if (response.status === 422 && data.detail) {
        const errorMsg = Array.isArray(data.detail) 
          ? data.detail[0]?.msg || "Validation failed"
          : data.detail
        return {
          success: false,
          error: errorMsg,
        }
      }

      // Handle other errors with detail field
      return {
        success: false,
        error: data.detail || data.message || "Registration failed",
      }
    } catch {
      // If JSON parsing fails, try text
      const errorText = await response.text()
      return {
        success: false,
        error: errorText || "Registration failed",
      }
    }
  } catch (err) {
    // Check if it's a CORS error
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      return {
        success: false,
        error: "CORS error: Cannot connect to server. Please ensure CORS is enabled on the backend at " + serverUrl,
      }
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "An error occurred during registration",
    }
  }
}

/**
 * Logs in a user
 */
export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const serverUrl = getServerUrl()

  if (!serverUrl) {
    return {
      success: false,
      error: "Server URL is not configured",
    }
  }

  try {
    // Create form-urlencoded data as required by backend
    // Note: Backend expects 'username' field, not 'email'
    const formData = new URLSearchParams()
    formData.append('email', credentials.email)  // Backend uses 'username' field
    formData.append('password', credentials.password)

    const response = await fetch(`${serverUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    // Parse response
    try {
      const data = await response.json()

      if (!response.ok) {
        // Handle 422 validation errors
        if (response.status === 422 && data.detail) {
          const errorMsg = Array.isArray(data.detail) 
            ? data.detail[0]?.msg || "Validation failed"
            : data.detail
          return {
            success: false,
            error: errorMsg,
          }
        }
        
        return {
          success: false,
          error: data.detail || data.message || "Login failed",
        }
      }

      // Success - backend returns { access_token, token_type }
      const accessToken = data.access_token || data.token

      return {
        success: true,
        message: "Login successful",
        token: accessToken,
        access_token: data.access_token,
        token_type: data.token_type || "bearer",
        user: data.user || { email: credentials.email, id: data.user_id },
      }
    } catch (parseError) {
      return {
        success: false,
        error: "Failed to parse server response",
      }
    }
  } catch (err) {
    // Check if it's a CORS error
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      return {
        success: false,
        error: "CORS error: Cannot connect to server. Please ensure CORS is enabled on the backend at " + serverUrl,
      }
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "An error occurred during login",
    }
  }
}

/**
 * Gets the current authenticated user
 */
export async function getCurrentUser(): Promise<GetCurrentUserResponse> {
  const serverUrl = getServerUrl()

  if (!serverUrl) {
    return {
      success: false,
      error: "Server URL is not configured",
    }
  }

  // Get token from localStorage
  const token = localStorage.getItem("authToken")
  const tokenType = localStorage.getItem("tokenType") || "bearer"

  if (!token) {
    return {
      success: false,
      error: "No authentication token found",
    }
  }

  try {
    const response = await fetch(`${serverUrl}/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} ${token}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || "Failed to get current user",
      }
    }

    return {
      success: true,
      user: data,
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An error occurred while fetching user",
    }
  }
}

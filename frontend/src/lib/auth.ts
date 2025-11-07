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

    // Backend returns 201 with a simple string response
    if (response.status === 201) {
      const message = await response.text()
      return {
        success: true,
        message: message || "Account created successfully",
      }
    }

    // Handle 422 validation errors
    if (response.status === 422) {
      const data = await response.json()
      // Extract error message from validation error format
      const errorMsg = data.detail?.[0]?.msg || "Validation failed"
      return {
        success: false,
        error: errorMsg,
      }
    }

    // Handle other errors
    const errorText = await response.text()
    return {
      success: false,
      error: errorText || "Registration failed",
    }
  } catch (err) {
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
    const formData = new URLSearchParams()
    formData.append('email', credentials.email)
    formData.append('password', credentials.password)

    const response = await fetch(`${serverUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      // Handle 422 validation errors
      if (response.status === 422) {
        const errorMsg = data.detail?.[0]?.msg || "Validation failed"
        return {
          success: false,
          error: errorMsg,
        }
      }
      
      return {
        success: false,
        error: data.detail || "Login failed",
      }
    }

    // Support both 'access_token' (JWT standard) and 'token' formats
    const accessToken = data.access_token || data.token

    return {
      success: true,
      message: "Login successful",
      token: accessToken,
      access_token: data.access_token,
      token_type: data.token_type || "bearer",
      user: data.user || { email: credentials.email, id: data.user_id },
    }
  } catch (err) {
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

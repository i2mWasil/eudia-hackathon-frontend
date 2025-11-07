/**
 * API client utilities for making authenticated requests with JWT tokens
 */

/**
 * Gets the server URL from environment variables
 */
export function getServerUrl(): string {
  return import.meta.env.VITE_SERVER_URL || ""
}

/**
 * Gets the authorization header for API requests
 */
export function getAuthHeader(): string {
  const token = localStorage.getItem("authToken")
  const tokenType = localStorage.getItem("tokenType") || "bearer"
  
  if (!token) return ""
  
  return `${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} ${token}`
}

/**
 * Makes an authenticated API request
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const authHeader = getAuthHeader()
  
  const headers = {
    "Content-Type": "application/json",
    ...(authHeader && { Authorization: authHeader }),
    ...options.headers,
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

/**
 * Makes an authenticated GET request
 */
export async function authenticatedGet<T>(url: string): Promise<T> {
  const serverUrl = getServerUrl()
  const fullUrl = url.startsWith("http") ? url : `${serverUrl}${url}`
  
  const response = await authenticatedFetch(fullUrl, {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Makes an authenticated POST request
 */
export async function authenticatedPost<T>(
  url: string,
  data: unknown
): Promise<T> {
  const serverUrl = getServerUrl()
  const fullUrl = url.startsWith("http") ? url : `${serverUrl}${url}`
  
  const response = await authenticatedFetch(fullUrl, {
    method: "POST",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Makes an authenticated PUT request
 */
export async function authenticatedPut<T>(
  url: string,
  data: unknown
): Promise<T> {
  const serverUrl = getServerUrl()
  const fullUrl = url.startsWith("http") ? url : `${serverUrl}${url}`
  
  const response = await authenticatedFetch(fullUrl, {
    method: "PUT",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Makes an authenticated DELETE request
 */
export async function authenticatedDelete<T>(url: string): Promise<T> {
  const serverUrl = getServerUrl()
  const fullUrl = url.startsWith("http") ? url : `${serverUrl}${url}`
  
  const response = await authenticatedFetch(fullUrl, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Sanitizes markdown content from API responses
 * Handles escaped newlines and other common issues
 */
export function sanitizeMarkdown(input: string | object): string {
  let mdString: string

  // If input is an object, extract the markdown content
  if (typeof input === 'object' && input !== null) {
    // Try to get the first value if it's a simple object
    const values = Object.values(input)
    if (values.length > 0 && typeof values[0] === 'string') {
      mdString = values[0]
    } else {
      // Fallback to JSON stringifying if structure is complex
      mdString = JSON.stringify(input)
    }
  } else if (typeof input === 'string') {
    mdString = input
  } else {
    return ''
  }

  // Replace literal '\n' with actual newlines
  let sanitized = mdString.replace(/\\n/g, '\n')
  
  // Replace literal '\t' with actual tabs
  sanitized = sanitized.replace(/\\t/g, '\t')
  
  // Replace literal '\"' with actual quotes
  sanitized = sanitized.replace(/\\"/g, '"')
  
  // Replace literal '\\' with single backslash (but not before n, t, or ")
  sanitized = sanitized.replace(/\\(?![nt"])/g, '')
  
  // Trim any leading/trailing whitespace
  sanitized = sanitized.trim()

  return sanitized
}

/**
 * Extracts markdown from API response object
 * Handles common API response structures
 */
export function extractMarkdownFromResponse(response: any): string {
  // Handle different response structures
  if (typeof response === 'string') {
    return sanitizeMarkdown(response)
  }

  // Check for common field names
  const possibleFields = ['respmd', 'markdown', 'content', 'data', 'text', 'response']
  
  for (const field of possibleFields) {
    if (response[field]) {
      return sanitizeMarkdown(response[field])
    }
  }

  // If no known field found, try to extract first string value
  return sanitizeMarkdown(response)
}

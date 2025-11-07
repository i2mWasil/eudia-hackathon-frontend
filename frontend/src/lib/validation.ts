/**
 * Validation utilities for form inputs
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validates if password and confirm password match
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: "Passwords do not match",
    }
  }
  return { isValid: true }
}

/**
 * Validates password length
 */
export function validatePasswordLength(
  password: string,
  minLength: number = 8
): ValidationResult {
  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters long`,
    }
  }
  return { isValid: true }
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address",
    }
  }
  return { isValid: true }
}

/**
 * Validates complete signup form
 */
export function validateSignupForm(
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult {
  // Validate email
  const emailValidation = validateEmail(email)
  if (!emailValidation.isValid) {
    return emailValidation
  }

  // Validate password length
  const passwordValidation = validatePasswordLength(password)
  if (!passwordValidation.isValid) {
    return passwordValidation
  }

  // Validate password match
  const passwordMatchValidation = validatePasswordMatch(password, confirmPassword)
  if (!passwordMatchValidation.isValid) {
    return passwordMatchValidation
  }

  return { isValid: true }
}

/**
 * Validates login form
 */
export function validateLoginForm(
  email: string,
  password: string
): ValidationResult {
  // Validate email
  const emailValidation = validateEmail(email)
  if (!emailValidation.isValid) {
    return emailValidation
  }

  // Check if password is not empty
  if (!password || password.trim().length === 0) {
    return {
      isValid: false,
      error: "Password is required",
    }
  }

  return { isValid: true }
}

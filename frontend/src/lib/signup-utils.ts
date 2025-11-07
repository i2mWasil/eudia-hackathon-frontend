import type { FormEvent } from "react"
import { validateSignupForm } from "./validation"
import { registerUser } from "./auth"

export interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
}

export interface SignupFormState {
  error: string
  loading: boolean
  success: boolean
}

/**
 * Handles signup form submission
 */
export async function handleSignupSubmit(
  e: FormEvent<HTMLFormElement>,
  formData: SignupFormData,
  setState: (state: Partial<SignupFormState>) => void,
  resetForm: () => void,
  onSuccess?: () => void
): Promise<void> {
  e.preventDefault()
  setState({ error: "", success: false, loading: true })

  // Validate form inputs
  const validation = validateSignupForm(
    formData.email,
    formData.password,
    formData.confirmPassword
  )
  
  if (!validation.isValid) {
    setState({ error: validation.error || "Validation failed", loading: false })
    return
  }

  // Register user
  const result = await registerUser({
    email: formData.email,
    password: formData.password,
  })

  if (!result.success) {
    setState({ error: result.error || "Registration failed", loading: false })
    return
  }

  setState({ loading: false, success: true })
  resetForm()

  // Call success callback if provided
  if (onSuccess) {
    onSuccess()
  }
}

import type { FormEvent } from "react"
import { validateLoginForm } from "./validation"
import { loginUser } from "./auth"

export interface LoginFormData {
  email: string
  password: string
}

export interface LoginFormState {
  error: string
  loading: boolean
  success: boolean
}

export interface LoginFormHandlers {
  handleSubmit: (
    e: FormEvent<HTMLFormElement>,
    formData: LoginFormData,
    setState: (state: Partial<LoginFormState>) => void,
    resetForm: () => void
  ) => Promise<void>
}

/**
 * Handles login form submission
 */
export async function handleLoginSubmit(
  e: FormEvent<HTMLFormElement>,
  formData: LoginFormData,
  setState: (state: Partial<LoginFormState>) => void,
  resetForm: () => void,
  onSuccess?: (result: { email: string; token: string; userId?: string; tokenType?: string }) => void
): Promise<void> {
  e.preventDefault()
  setState({ error: "", loading: true })

  // Validate form inputs
  const validation = validateLoginForm(formData.email, formData.password)
  if (!validation.isValid) {
    setState({ error: validation.error || "Validation failed", loading: false })
    return
  }

  // Login user
  const result = await loginUser({
    email: formData.email,
    password: formData.password,
  })

  if (!result.success) {
    setState({ error: result.error || "Login failed", loading: false })
    return
  }

  setState({ loading: false, success: true })
  resetForm()

  // Call success callback if provided
  if (onSuccess && result.token && result.user) {
    onSuccess({
      email: result.user.email,
      token: result.token,
      userId: result.user.id,
      tokenType: result.token_type || "bearer",
    })
  }
}

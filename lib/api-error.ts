import type { AxiosError } from "axios"

interface ApiFieldError {
  field: string
  messages: string[]
}

interface ApiErrorResponse {
  message?: string
  errors?: ApiFieldError[]
}

export function getApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>
  const data = axiosError.response?.data

  if (data?.errors?.length) {
    return data.errors.flatMap((item) => item.messages).join(" ")
  }

  if (typeof data?.message === "string") {
    return data.message
  }

  return "An unexpected error occurred. Please try again."
}

export function getApiFieldErrors(error: unknown): Record<string, string[]> {
  const axiosError = error as AxiosError<ApiErrorResponse>
  const errors = axiosError.response?.data?.errors

  if (!Array.isArray(errors)) {
    return {}
  }

  return Object.fromEntries(errors.map((item) => [item.field, item.messages]))
}

// lib/axios-instance.ts
"use client"

import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios"

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7777/api/v1"

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Allows the browser to send/receive auth cookies for allowed origins.
  withCredentials: true,
})

type CsrfResponse = {
  csrfToken?: string
}

type ApiResponse<T> = {
  data?: T
} & T

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

const UNSAFE_METHODS = new Set(["post", "put", "patch", "delete"])

const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
]

// Stored only in the current browser tab's JS memory.
let csrfToken: string | null = null

// Ensures simultaneous 401 responses wait for one refresh request.
let refreshPromise: Promise<void> | null = null

function isAuthEndpoint(url?: string) {
  return AUTH_ENDPOINTS.some((endpoint) => url?.includes(endpoint))
}

function extractCsrfToken(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null
  }

  const response = data as ApiResponse<CsrfResponse>
  const nested = response.data

  // Supports:
  // { csrfToken: "..." }
  // { data: { csrfToken: "..." } }
  if (
    nested &&
    typeof nested === "object" &&
    typeof nested.csrfToken === "string"
  ) {
    return nested.csrfToken
  }

  if (typeof response.csrfToken === "string") {
    return response.csrfToken
  }

  return null
}

function setCsrfHeader(headers: AxiosHeaders, token: string) {
  headers.set("X-CSRF-Token", token)
}

async function ensureCsrfToken() {
  if (csrfToken) return
  // Đổi thành endpoint thật của bạn (GET /auth/csrf, /auth/me, ...)
  const res = await axiosInstance.get("/auth/csrf")
  csrfToken = extractCsrfToken(res.data)
}

axiosInstance.interceptors.request.use(async (config) => {
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    config.headers.delete("Content-Type")
  }

  const method = config.method?.toLowerCase()
  if (method && UNSAFE_METHODS.has(method)) {
    if (!isAuthEndpoint(config.url)) await ensureCsrfToken()
    if (csrfToken) setCsrfHeader(config.headers, csrfToken)
  }

  return config
})

// Save a CSRF token whenever the API provides one.
axiosInstance.interceptors.response.use(
  (response) => {
    const token = extractCsrfToken(response.data)

    if (token) {
      csrfToken = token
    }

    return response
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined

    const shouldNotRefresh =
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)

    if (shouldNotRefresh) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = axiosInstance
          .post("/auth/refresh")
          .then(() => undefined)
          .finally(() => {
            refreshPromise = null
          })
      }

      await refreshPromise

      // Retry the original request after a successful refresh.
      return axiosInstance.request(originalRequest)
    } catch (refreshError: unknown) {
      clearCsrfToken()

      if (axios.isAxiosError(refreshError)) {
        console.error("Token refresh failed:", {
          status: refreshError.response?.status,
          data: refreshError.response?.data,
          url: refreshError.config?.url,
        })
      } else {
        console.error("Unknown token-refresh failure:", refreshError)
      }

      return Promise.reject(refreshError)
    }
  }
)

export function clearCsrfToken() {
  csrfToken = null
}

export function getCsrfToken() {
  return csrfToken
}

export default axiosInstance
export { axiosInstance }

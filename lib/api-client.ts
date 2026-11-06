import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

const CSRF_HEADER = "X-CSRF-Token"
const SKIP_REFRESH = ["/auth/signin", "/auth/signup", "/auth/refresh"]
const CSRF_ENDPOINTS = ["/auth/signin", "/auth/signup", "/auth/refresh", "/auth/logout"]
type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

let csrfToken: string | null = null
let refreshPromise: Promise<void> | null = null

function getCsrfToken() {
  if (csrfToken) return csrfToken
  return csrfToken
}

export function setCsrfToken(token: string | null) {
  csrfToken = token
}

function extractCsrfToken(data: unknown): string | null {
  if (!data || typeof data !== "object") return null

  const response = data as {
    csrfToken?: unknown
    data?: { csrfToken?: unknown }
  }
  const nestedToken = response.data?.csrfToken

  if (typeof nestedToken === "string") return nestedToken
  return typeof response.csrfToken === "string" ? response.csrfToken : null
}

async function ensureCsrfToken() {
  if (getCsrfToken()) return

  const response = await api.get("/auth/csrf")
  const token = extractCsrfToken(response.data)
  if (token) setCsrfToken(token)
}

async function doRefresh() {
  if ("locks" in navigator) {
    await navigator.locks.request("auth-refresh", async () => {
      const response = await api.post<{ data?: { csrfToken?: string } }>(
        "/auth/refresh"
      )
      const token = response.data.data?.csrfToken
      if (token) setCsrfToken(token)
    })
  } else {
    const response = await api.post<{ data?: { csrfToken?: string } }>(
      "/auth/refresh"
    )
    const token = response.data.data?.csrfToken
    if (token) setCsrfToken(token)
  }
}

function refreshOnce() {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise
}

api.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase()
  const isUnsafeMethod = ["post", "put", "patch", "delete"].includes(
    method ?? ""
  )

  if (!isUnsafeMethod || CSRF_ENDPOINTS.some((path) => config.url?.includes(path))) {
    return config
  }

  return ensureCsrfToken().then(() => {
    const token = getCsrfToken()
    if (token) config.headers.set(CSRF_HEADER, token)
    return config
  })
})

api.interceptors.response.use(
  (res) => {
    const token = extractCsrfToken(res.data)
    if (token) setCsrfToken(token)
    return res
  },
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;

    const shouldRefresh =
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !SKIP_REFRESH.some((p) => original.url?.includes(p));

    if (!shouldRefresh) return Promise.reject(error)

    original._retry = true
    try {
      await refreshOnce()
      return api(original)
    } catch (e) {
      window.location.replace(
        new URL("/signin", window.location.origin).toString()
      )
      return Promise.reject(e)
    }
  },
)
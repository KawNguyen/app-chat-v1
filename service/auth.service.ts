import { api, setCsrfToken } from "@/lib/api-client"
import type {
  ApiResponse,
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth.type"

export const authService = {
  register: async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>(
      "/auth/signup",
      data
    )

    setCsrfToken(response.data.data.csrfToken)
    return response.data
  },

  login: async (data: LoginRequest) => {
    const response = await api.post<AuthResponse>("/auth/signin", data)

    setCsrfToken(response.data.data.csrfToken)
    return response.data
  },

  me: async () => {
    const response = await api.get<ApiResponse<AuthUser>>("/users/me")

    return response.data
  },

  logout: async () => {
    await api.post("/auth/logout")
    setCsrfToken(null)
  },

  logoutAll: async () => {
    await api.post("/auth/logout-all")
    setCsrfToken(null)
  },
}

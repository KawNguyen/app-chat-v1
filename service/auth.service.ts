import axiosInstance from "@/lib/axios-instance"
import type {
  ApiResponse,
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth.type"

export const authService = {
  register: async (data: RegisterRequest) => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/register",
      data
    )

    return response.data
  },

  login: async (data: LoginRequest) => {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", data)

    return response.data
  },

  me: async () => {
    const response = await axiosInstance.get<ApiResponse<AuthUser>>("/users/me")

    return response.data
  },

  refresh: async () => {
    const response =
      await axiosInstance.post<ApiResponse<{ csrfToken: string }>>(
        "/auth/refresh"
      )

    return response.data
  },

  logout: async () => {
    await axiosInstance.post("/auth/logout")
  },

  logoutAll: async () => {
    await axiosInstance.post("/auth/logout-all")
  },
}

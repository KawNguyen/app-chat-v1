export interface RegisterRequest {
  email: string
  username: string
  displayName: string
  password: string
}

export interface LoginRequest {
  identifier: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  username: string
  displayName: string
  avatarUrl: string | null
  isActive: boolean
  role: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  data: {
    user: AuthUser
    csrfToken: string
  }
}

export interface LoginRequest {
  identifier: string
  password: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
}

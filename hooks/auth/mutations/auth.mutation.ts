"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { LoginRequest, RegisterRequest } from "@/types/auth.type"
import { authService } from "@/service/auth.service"
import { authKeys } from "../auth.constant"
import { clearCsrfToken } from "@/lib/axios-instance"
import { useRouter } from "next/navigation"

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),

    onSuccess: (result) => {
      // Chỉ xóa cache khi đăng nhập thành công.
      queryClient.clear()

      // Cache thông tin user của phiên đăng nhập hiện tại.
      queryClient.setQueryData(authKeys.me(), result.data.user)
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: () => authService.logout(),

    onSuccess: () => {
      clearCsrfToken()
      queryClient.clear()

      router.push("/signin")
    },
  })
}

export function useLogoutAll() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: () => authService.logoutAll(),

    onSettled: () => {
      clearCsrfToken()
      queryClient.clear()
      router.push("/signin")
    },
  })
}

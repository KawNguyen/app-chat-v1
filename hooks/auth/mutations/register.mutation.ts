import { authService } from "@/service/auth.service";
import { RegisterRequest } from "@/types/auth.type";
import { useMutation } from "@tanstack/react-query";

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
  })
}
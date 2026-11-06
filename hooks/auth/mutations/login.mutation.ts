import { useRefresh } from "@/hooks/use-refresh"
import { authService } from "@/service/auth.service"
import { LoginRequest } from "@/types/auth.type"
import { useMutation } from "@tanstack/react-query"
import { authKeys } from "../auth.constant"
import { toast } from "@/components/ui/toast"

export function useSignin() {
    const refresh = useRefresh([authKeys.me()])
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),

    onSuccess: () => {
      refresh()

      toast.add({
        title: "Đăng nhập thành công",
        description: "Bạn đã đăng nhập thành công.",
        type: "success",
      })
    },
  })
}
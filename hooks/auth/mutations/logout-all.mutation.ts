import { authService } from "@/service/auth.service"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authKeys } from "../auth.constant"
import { useRefresh } from "@/hooks/use-refresh"

export function useLogoutAll() {
    const refresh = useRefresh([authKeys.me()])
  const router = useRouter()

  return useMutation({
    mutationFn: () => authService.logoutAll(),

    onSettled: () => {
        refresh()
      router.push("/signin")
    },
  })
}
import { useRefresh } from "@/hooks/use-refresh"
import { authService } from "@/service/auth.service"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authKeys } from "../auth.constant"

export function useLogout() {
    const refresh = useRefresh([authKeys.me()])
  const router = useRouter()

  return useMutation({
    mutationFn: () => authService.logout(),

    onSuccess: () => {
      refresh()
      router.push("/signin")
    },
  })
}
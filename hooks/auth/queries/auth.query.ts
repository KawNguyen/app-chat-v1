import { useQuery } from "@tanstack/react-query"
import { authService } from "@/service/auth.service"
import { authKeys } from "../auth.constant"

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authService.me().then((res) => res.data),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

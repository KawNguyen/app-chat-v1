import { userService } from "@/service/user.service"
import { GetUsersParams } from "@/types/user.type"
import { useQuery } from "@tanstack/react-query"

export const userKeys = {
  all: ["users"] as const,
  list: (params: GetUsersParams) => [...userKeys.all, "list", params] as const,
}

export function useGetUsers(params: GetUsersParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params).then((res) => res.data),
    staleTime: 1000 * 60 * 10, // 10 phút refresh 1 lần
    enabled: !!params.search?.trim(),
  })
}

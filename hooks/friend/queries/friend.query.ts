import { friendService } from "@/service/friend.service"
import { useQuery } from "@tanstack/react-query"

export const friendKeys = {
  all: ["friends"] as const,
  detail: (friendId: string) =>
    [...friendKeys.all, "detail", friendId] as const,
}

export function useGetFriends(enabled: boolean) {
  return useQuery({
    queryKey: friendKeys.all,
    queryFn: friendService.getAcceptedFriends,
    staleTime: 1000 * 60 * 10, // 10 phút
    enabled,
  })
}

import { toast } from "@/components/ui/toast"
import { useRefresh } from "@/hooks/use-refresh"
import { userKeys } from "@/hooks/user/queries/user.query"
import { friendService } from "@/service/friend.service"
import { useMutation } from "@tanstack/react-query"
import { friendKeys } from "../queries/friend.query"

export function useRejectFriendRequest(search: string) {
  const refresh = useRefresh([userKeys.list({ search }), friendKeys.all])
  return useMutation({
    mutationFn: (requestId: string) =>
      friendService.rejectFriendRequest(requestId),
    onSuccess: () => {
      refresh()
      toast.add({
        title: "Đã từ chối yêu cầu kết bạn",
        description: "Yêu cầu kết bạn đã được từ chối.",
        type: "success",
      })
    },
    onError: () => {
      refresh()
      toast.add({
        title: "Lỗi",
        description: "Không từ chối được yêu cầu kết bạn. Thử lại sau.",
        type: "error",
      })
    },
  })
}

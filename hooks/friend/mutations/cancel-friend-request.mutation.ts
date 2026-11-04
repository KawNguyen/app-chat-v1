import { useRefresh } from "@/hooks/use-refresh"
import { userKeys } from "@/hooks/user/queries/user.query"
import { friendService } from "@/service/friend.service"
import { useMutation } from "@tanstack/react-query"
import { friendKeys } from "../queries/friend.query"
import { toast } from "@/components/ui/toast"

export function useCancelFriendRequest(search: string) {
  const refresh = useRefresh([userKeys.list({ search }), friendKeys.all])
  return useMutation({
    mutationFn: (requestId: string) =>
      friendService.cancelFriendRequest(requestId),
    onSuccess: () => {
      refresh()
      toast.add({
        title: "Đã hủy yêu cầu kết bạn",
        description: "Yêu cầu kết bạn đã được hủy.",
        type: "success",
      })
    },
    onError: () => {
      refresh()
      toast.add({
        title: "Lỗi",
        description: "Không hủy được yêu cầu kết bạn. Thử lại sau.",
        type: "error",
      })
    },
  })
}

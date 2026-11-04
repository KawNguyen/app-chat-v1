import { useMutation } from "@tanstack/react-query"
import { friendService } from "@/service/friend.service"
import { toast } from "@/components/ui/toast"
import { userKeys } from "@/hooks/user/queries/user.query"
import { useRefresh } from "@/hooks/use-refresh"
import { friendKeys } from "../queries/friend.query"

export function useSendFriendRequest(search: string) {
  const refresh = useRefresh([userKeys.list({ search }), friendKeys.all])
  return useMutation({
    mutationFn: (addresseeId: string) =>
      friendService.sendFriendRequest(addresseeId),
    onSuccess: () => {
      refresh()
      toast.add({
        title: "Đã gửi yêu cầu kết bạn",
        description: "Yêu cầu kết bạn đã được gửi.",
        type: "success",
      })
    },
    onError: () =>
      toast.add({
        title: "Lỗi",
        description: "Không gửi được yêu cầu kết bạn. Thử lại sau.",
        type: "error",
      }),
  })
}

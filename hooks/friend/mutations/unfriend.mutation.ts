import { useRefresh } from "@/hooks/use-refresh"
import { friendKeys } from "../queries/friend.query"
import { userKeys } from "@/hooks/user/queries/user.query"
import { useMutation } from "@tanstack/react-query"
import { friendService } from "@/service/friend.service"
import { toast } from "@/components/ui/toast"

export function useUnfriend(search: string) {
  const refresh = useRefresh([userKeys.list({ search }), friendKeys.all])
  return useMutation({
    mutationFn: (friendId: string) => friendService.unfriend(friendId),
    onSuccess: () => {
      refresh()
      toast.add({
        title: "Đã hủy kết bạn",
        description: "Bạn đã hủy kết bạn với người này.",
        type: "success",
      })
    },
    onError: () => {
      refresh()
      toast.add({
        title: "Lỗi",
        description: "Không hủy được kết bạn. Thử lại sau.",
        type: "error",
      })
    },
  })
}

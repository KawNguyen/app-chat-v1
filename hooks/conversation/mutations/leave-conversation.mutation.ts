import { useRefresh } from "@/hooks/use-refresh"
import { conversationKeys } from "../queries/conversation.query"
import { useMutation } from "@tanstack/react-query"
import { conversationService } from "@/service/conversation.service"
import { toast } from "@/components/ui/toast"

export function useLeaveConversation() {
  const refresh = useRefresh([conversationKeys.all])
  return useMutation({
    mutationFn: conversationService.leaveConversation,
    onSuccess: () => {
      refresh()
      toast.add({
        title: "Đã rời nhóm",
        description: "Bạn đã rời khỏi nhóm.",
        type: "success",
      })
    },
    onError: () =>
      toast.add({
        title: "Lỗi",
        description: "Không rời được nhóm. Thử lại sau.",
        type: "error",
      }),
  })
}

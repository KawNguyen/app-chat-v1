import { useRefresh } from "@/hooks/use-refresh"
import { useMutation } from "@tanstack/react-query"
import { conversationKeys } from "../queries/conversation.query"
import { conversationService } from "@/service/conversation.service"
import { toast } from "@/components/ui/toast"

export function useDeleteConversation() {
  const refresh = useRefresh([conversationKeys.all])
  return useMutation({
    mutationFn: conversationService.deleteConversation,
    onSuccess: () => {
      refresh()
      toast.add({
        title: "Đã xoá nhóm",
        description: "Nhóm đã được xoá.",
        type: "success",
      })
    },
    onError: () =>
      toast.add({
        title: "Lỗi",
        description: "Chỉ trưởng nhóm mới xoá được nhóm.",
        type: "error",
      }),
  })
}

import { useRefresh } from "@/hooks/use-refresh"
import { conversationService } from "@/service/conversation.service"
import { useMutation } from "@tanstack/react-query"
import { conversationKeys } from "../queries/conversation.query"
import { toast } from "@/components/ui/toast"

export function useUpdateGroup(convId: string) {
  const refresh = useRefresh([conversationKeys.all])
  return useMutation({
    mutationFn: (input: {
      name?: string
      avatar?: File | null
      removeAvatar?: boolean
    }) => conversationService.updateConversation(convId, input),
    onSuccess: () => {
      refresh()
      toast.add({
        title: "Đã cập nhật nhóm",
        description: `Đã cập nhật nhóm với thông tin`,
        type: "success",
      })
    },
    onError: () =>
      toast.add({
        title: "Lỗi",
        description: "Bạn không có quyền cập nhật nhóm này.",
        type: "error",
      }),
  })
}

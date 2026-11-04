import { useRefresh } from "@/hooks/use-refresh"
import { conversationService } from "@/service/conversation.service"
import { useMutation } from "@tanstack/react-query"
import { conversationKeys } from "../queries/conversation.query"
import { toast } from "@/components/ui/toast"

export function useCreateGroup() {
  const refresh = useRefresh([conversationKeys.all])
  return useMutation({
    mutationFn: (data: { name: string; memberIds: string[] }) =>
      conversationService.createConversation({ type: "group", ...data }),
    onSuccess: () => {
      refresh()
      toast.add({
        title: "Đã tạo nhóm",
        description: "Bạn có thể đổi tên nhóm và thêm bớt thành viên sau.",
        type: "success",
      })
    },
    onError: () =>
      toast.add({
        title: "Lỗi",
        description: "Không tạo được nhóm. Thử lại sau.",
        type: "error",
      }),
  })
}

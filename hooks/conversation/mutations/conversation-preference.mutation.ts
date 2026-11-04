import { useRefresh } from "@/hooks/use-refresh"
import { useMutation } from "@tanstack/react-query"
import { conversationKeys } from "../queries/conversation.query"
import { conversationService } from "@/service/conversation.service"
import { toast } from "@/components/ui/toast"

export function useConversationPreference(convId: string) {
  const refresh = useRefresh([conversationKeys.all])
  return useMutation({
    mutationFn: ({
      ...data
    }: {
      isPinned?: boolean
      mutedUntil?: string | null
    }) => conversationService.updateSettings(convId, data),
    onSuccess: refresh,
    onError: () =>
      toast.add({
        title: "Lỗi",
        description: "Không cập nhật được. Thử lại sau.",
        type: "error",
      }),
  })
}

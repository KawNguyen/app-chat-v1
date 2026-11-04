import { messageService } from "@/service/message.service"
import { useMutation } from "@tanstack/react-query"
import { keyMessage } from "../queries/message.query"
import { useRefresh } from "@/hooks/use-refresh"

export function useSendMessage(convId: string) {
  const refresh = useRefresh([keyMessage.list(convId)])
  return useMutation({
    mutationFn: (content: string) =>
      messageService.sendMessage(convId, content),
    onSuccess: () => {
      refresh()
    },
  })
}

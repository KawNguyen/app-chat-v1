import { messageService } from "@/service/message.service"
import { useQuery } from "@tanstack/react-query"

export const keyMessage = {
  all: ["messages"] as const,
  list: (convId: string) => [...keyMessage.all, "list", convId] as const,
}

export function useMessage(convId: string) {
  return useQuery({
    queryKey: keyMessage.list(convId),
    queryFn: async () =>
      messageService.getMessages(convId).then((res) => res.data),
  })
}

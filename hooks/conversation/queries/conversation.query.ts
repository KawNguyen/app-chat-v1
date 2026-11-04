import { conversationService } from "@/service/conversation.service"
import { useQuery } from "@tanstack/react-query"

export const conversationKeys = {
  all: ["conversations"] as const,
  detail: (convId: string) =>
    [...conversationKeys.all, "detail", convId] as const,
}

export function useConversations() {
  return useQuery({
    queryKey: conversationKeys.all,
    queryFn: () =>
      conversationService.getConversations().then((res) => res.data),
    staleTime: 1000 * 60 * 10, // 10 phút
  })
}

export function useConversation(convId: string) {
  return useQuery({
    queryKey: conversationKeys.detail(convId),
    queryFn: () =>
      conversationService.getConversation(convId).then((res) => res.data),
    enabled: !!convId,
    staleTime: 1000 * 60 * 10, // 10 phút
  })
}

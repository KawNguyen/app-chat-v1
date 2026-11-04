import type { MessageReactionSummary } from "./message-reaction.type"

export interface MessageSender {
  id: string
  username: string
  displayName: string | null
  avatarUrl: string | null
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  sender: MessageSender
  content: string
  editedAt: string | null
  deletedAt: string | null
  createdAt: string
  reactions?: MessageReactionSummary[]
}

export interface GetMessagesParams {
  limit?: number
  cursor?: string
}

export interface MessageListMeta {
  limit: number
  hasMore: boolean
  nextCursor: string | null
}

export interface MessageListResponse {
  items: Message[]
  meta: MessageListMeta
}

export interface CreateMessageDto {
  content: string
}

export interface UpdateMessageDto {
  content: string
}

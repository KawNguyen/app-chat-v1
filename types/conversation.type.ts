export type ConversationType = "direct" | "group"
export type ConversationMemberRole = "owner" | "admin" | "member"
export type ConversationPermission =
  | "rename_group"
  | "add_member"
  | "remove_member"
  | "delete_message"
  | "change_avatar"

/** Dữ liệu riêng của user hiện tại trong cuộc trò chuyện */
export interface ConversationMe {
  role: ConversationMemberRole
  isPinned: boolean
  mutedUntil: string | null
  unreadCount: number
}

export interface ConversationMember {
  userId: string
  role: ConversationMemberRole
  username: string
  displayName: string
  avatarUrl: string | null
  joinedAt: string
}

export interface ConversationLastMessage {
  id: string
  conversationId: string
  content: string
  senderId: string
  senderName?: string
  createdAt: string
}

export interface ConversationListItem {
  id: string
  type: ConversationType
  name: string | null
  avatarUrl: string | null
  /** Các quyền OWNER đã cấp cho ADMIN */
  adminPermissions: ConversationPermission[]
  me: ConversationMe
  members: ConversationMember[]
  lastMessage: ConversationLastMessage | null
  createdAt: string
  updatedAt: string
}

export interface FriendOption {
  id: string
  displayName: string
  avatarUrl: string | null
}

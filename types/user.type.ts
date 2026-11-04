export interface GetUsersParams {
  page?: number
  limit?: number
  search?: string
}

export interface UserListItem {
  id: string
  username: string
  displayName: string | null
  avatarUrl: string | null
  createdAt: string
  friendshipId: string | null
  friendshipStatus: "accepted" | "pending"
  friendshipDirection: "incoming" | "outgoing" | null
  isFriend: boolean
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

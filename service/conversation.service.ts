import { api } from "@/lib/api-client"

export const conversationService = {
  getConversations: async () => {
    const response = await api.get("/conversations")
    return response.data
  },

  getConversation: async (conversationId: string) => {
    const response = await api.get(`/conversations/${conversationId}`)
    return response.data
  },

  createConversation: async (data: {
    type: "direct" | "group"
    name?: string
    memberIds: string[]
  }) => {
    const response = await api.post("/conversations", data)
    return response.data
  },

  updateConversation: async (
    conversationId: string,
    {
      name,
      avatar,
      removeAvatar,
    }: { name?: string; avatar?: File | null; removeAvatar?: boolean }
  ) => {
    // Chỉ gửi multipart khi có file hoặc xoá avatar; còn lại gửi JSON như cũ
    const form = new FormData()
    if (name !== undefined) form.append("name", name)
    if (avatar) form.append("avatar", avatar)
    if (removeAvatar) form.append("removeAvatar", "true")

    const response = await api.patch(
      `/conversations/${conversationId}`,
      form
    )
    return response.data
  },

  updateSettings: async (
    conversationId: string,
    data: { isPinned?: boolean; mutedUntil?: string | null }
  ) => {
    const response = await api.patch(
      `/conversations/${conversationId}/settings`,
      data
    )
    return response.data
  },

  deleteConversation: async (conversationId: string) => {
    const response = await api.delete(
      `/conversations/${conversationId}`
    )
    return response.data
  },

  leaveConversation: async (conversationId: string) => {
    const response = await api.delete(
      `/conversations/${conversationId}/members/me`
    )
    return response.data
  },
}

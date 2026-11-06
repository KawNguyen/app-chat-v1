import { api } from "@/lib/api-client"

export const messageService = {
  getMessages: async (convId: string) => {
    const response = await api.get(
      `/conversations/${convId}/messages`
    )
    return response.data
  },

  sendMessage: async (convId: string, content: string) => {
    const response = await api.post(
      `/conversations/${convId}/messages`,
      { content }
    )
    return response.data
  },

  patchMessage: async (convId: string, messageId: string, content: string) => {
    const response = await api.patch(
      `/conversations/${convId}/messages/${messageId}`,
      { content }
    )
    return response.data
  },

  deleteMessage: async (convId: string, messageId: string) => {
    const response = await api.delete(
      `/conversations/${convId}/messages/${messageId}`
    )
    return response.data
  },

  readMessage: async (convId: string, messageId: string) => {
    const response = await api.post(
      `/conversations/${convId}/messages/${messageId}/read`
    )
    return response.data
  },
}

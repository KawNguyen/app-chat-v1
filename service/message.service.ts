import axiosInstance from "@/lib/axios-instance"

export const messageService = {
  getMessages: async (convId: string) => {
    const response = await axiosInstance.get(
      `/conversations/${convId}/messages`
    )
    return response.data
  },

  sendMessage: async (convId: string, content: string) => {
    const response = await axiosInstance.post(
      `/conversations/${convId}/messages`,
      { content }
    )
    return response.data
  },

  patchMessage: async (convId: string, messageId: string, content: string) => {
    const response = await axiosInstance.patch(
      `/conversations/${convId}/messages/${messageId}`,
      { content }
    )
    return response.data
  },

  deleteMessage: async (convId: string, messageId: string) => {
    const response = await axiosInstance.delete(
      `/conversations/${convId}/messages/${messageId}`
    )
    return response.data
  },

  readMessage: async (convId: string, messageId: string) => {
    const response = await axiosInstance.post(
      `/conversations/${convId}/messages/${messageId}/read`
    )
    return response.data
  },
}

import { api } from "@/lib/api-client"

export const friendService = {
  getAcceptedFriends: async () => {
    const response = await api.get("/friends")
    return response.data
  },

  sendFriendRequest: async (addresseeId: string) => {
    const response = await api.post(`/friends/requests`, {
      addresseeId,
    })
    return response.data
  },

  rejectFriendRequest: async (requestId: string) => {
    const response = await api.delete(
      `/friends/requests/${requestId}`
    )
    return response.data
  },

  cancelFriendRequest: async (requestId: string) => {
    const response = await api.delete(
      `/friends/requests/${requestId}/cancel`
    )
    return response.data
  },

  unfriend: async (friendId: string) => {
    const response = await api.delete(`/friends/${friendId}`)
    return response.data
  },
}

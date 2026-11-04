import axiosInstance from "@/lib/axios-instance"

export const friendService = {
  getAcceptedFriends: async () => {
    const response = await axiosInstance.get("/friends")
    return response.data
  },

  sendFriendRequest: async (addresseeId: string) => {
    const response = await axiosInstance.post(`/friends/requests`, {
      addresseeId,
    })
    return response.data
  },

  rejectFriendRequest: async (requestId: string) => {
    const response = await axiosInstance.delete(
      `/friends/requests/${requestId}`
    )
    return response.data
  },

  cancelFriendRequest: async (requestId: string) => {
    const response = await axiosInstance.delete(
      `/friends/requests/${requestId}/cancel`
    )
    return response.data
  },

  unfriend: async (friendId: string) => {
    const response = await axiosInstance.delete(`/friends/${friendId}`)
    return response.data
  },
}

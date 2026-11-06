import { api } from "@/lib/api-client"
import { GetUsersParams } from "@/types/user.type"

export const userService = {
  getUsers: async (params: GetUsersParams) => {
    const response = await api.get("/users", {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
      },
    })
    return response.data
  },
}

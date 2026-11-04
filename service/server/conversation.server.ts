import { createServerApi } from "@/lib/api-server"

export async function getConversationsOnServer() {
  const api = await createServerApi()
  const response = await api.get("/conversations")
  return response.data
}

import { createServerApi } from "@/lib/api-server"

export async function getMessagesOnServer(convId: string) {
  const api = await createServerApi()

  const response = await api.get(`/conversations/${convId}/messages`)
  return response.data
}

import axios from "axios"
import { cookies, headers } from "next/headers"

const apiUrl =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:7777/api/v1"

export async function createServerApi() {
  const cookieStore = await cookies()
  const requestHeaders = await headers()

  const origin =
    requestHeaders.get("origin") ??
    process.env.APP_ORIGIN ?? // e.g. http://localhost:3000
    "http://localhost:3000"

  return axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
      Origin: origin,
    },
  })
}

export { cn } from "cn"

const API_URL = process.env.NEXT_PUBLIC_IMAGE_URL ?? "http://localhost:7777"

export function resolveAssetUrl(path?: string | null) {
  if (!path) return undefined
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path
  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`
}

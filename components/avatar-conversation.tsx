import { resolveAssetUrl } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export default function AvatarConversation({
  avatarUrl,
  title,
}: {
  name?: string
  avatarUrl?: string
  title: string
}) {
  return (
    <Avatar className="size-9 shrink-0">
      {avatarUrl && (
        <AvatarImage src={resolveAssetUrl(avatarUrl)} alt={title} />
      )}
      <AvatarFallback>{title.slice(0, 1).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

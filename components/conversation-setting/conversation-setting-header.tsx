import { Hash } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { resolveAssetUrl } from "@/lib/utils"

type Props = {
  name: string | null
  avatarUrl: string | null
  titleId?: string
}

export function ConversationSettingHeader({ name, avatarUrl, titleId }: Props) {
  return (
    <div className="flex h-16 shrink-0 items-center justify-center gap-3 border-b px-2 sm:justify-start sm:px-4">
      <Avatar className="size-10 shrink-0">
        <AvatarImage
          src={resolveAssetUrl(avatarUrl)}
          alt={avatarUrl ? "Avatar" : "Default"}
        />
        <AvatarFallback className="bg-primary/10 text-primary">
          <Hash className="size-5" />
        </AvatarFallback>
      </Avatar>

      <div className="hidden min-w-0 flex-1 sm:block">
        <h2 id={titleId} className="truncate text-sm font-semibold">
          {name?.trim() || "Server chưa có tên"}
        </h2>
        <p className="truncate text-xs text-muted-foreground">Cài đặt server</p>
      </div>
    </div>
  )
}

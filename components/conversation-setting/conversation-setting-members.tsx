import { Crown, ShieldCheck, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type {
  ConversationMember,
  ConversationMemberRole,
} from "@/types/conversation.type"
import {
  formatDate,
  getDisplayName,
  getInitials,
} from "@/utils/conversation.util"

const roleLabels: Record<ConversationMemberRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
}

type Props = {
  members: ConversationMember[]
}

export function ConversationSettingMembers({ members }: Props) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-semibold">Thành viên server</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Danh sách những người tham gia server này.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4" />
          Tổng số thành viên
        </div>
        <Badge variant="secondary">{members.length}</Badge>
      </div>

      <div className="space-y-2">
        {members.map((member) => {
          const displayName = getDisplayName(member)

          return (
            <div
              key={member.userId}
              className="flex items-center gap-3 rounded-xl border p-3"
            >
              <Avatar className="size-11 shrink-0">
                <AvatarImage
                  src={member.avatarUrl ?? undefined}
                  alt={displayName}
                />
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{displayName}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  @{member.username}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tham gia {formatDate(member.joinedAt)}
                </p>
              </div>

              <Badge
                variant={member.role === "owner" ? "default" : "secondary"}
                className="shrink-0 gap-1"
              >
                {member.role === "owner" && <Crown className="size-3" />}
                {member.role === "admin" && <ShieldCheck className="size-3" />}
                {roleLabels[member.role]}
              </Badge>
            </div>
          )
        })}
      </div>
    </section>
  )
}

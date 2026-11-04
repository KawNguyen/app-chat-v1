import { Check, Shield, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type {
  ConversationListItem,
  ConversationMemberRole,
  ConversationPermission,
} from "@/types/conversation.type"
import { can } from "@/utils/conversation.util"

const permissionLabels: Record<ConversationPermission, string> = {
  rename_group: "Đổi tên server",
  add_member: "Thêm thành viên",
  remove_member: "Xóa thành viên",
  delete_message: "Xóa tin nhắn",
  change_avatar: "Đổi ảnh đại diện",
}

const roleLabels: Record<ConversationMemberRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
}

const roleDescriptions: Record<ConversationMemberRole, string> = {
  owner: "Bạn là chủ sở hữu server.",
  admin: "Bạn là quản trị viên, chỉ có các quyền chủ server đã cấp.",
  member: "Bạn là thành viên server.",
}

type Props = {
  conversation: ConversationListItem
}

export function ConversationSettingPermissions({ conversation }: Props) {
  const role = conversation.me.role

  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-semibold">Quyền hạn</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Các thao tác bạn được phép thực hiện trong server.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border p-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Shield className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-medium">Vai trò hiện tại</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {roleDescriptions[role]}
          </p>
        </div>

        <Badge variant={role === "owner" ? "default" : "secondary"}>
          {roleLabels[role]}
        </Badge>
      </div>

      <div className="space-y-2">
        {(
          Object.entries(permissionLabels) as [ConversationPermission, string][]
        ).map(([permission, label]) => {
          const allowed = can(conversation, permission)

          return (
            <div
              key={permission}
              className="flex items-center gap-3 rounded-xl border p-3"
            >
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                  allowed
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {allowed ? (
                  <Check className="size-4" />
                ) : (
                  <X className="size-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {allowed
                    ? "Bạn được phép thực hiện thao tác này."
                    : "Bạn không có quyền thực hiện thao tác này."}
                </p>
              </div>

              <Badge variant={allowed ? "secondary" : "outline"}>
                {allowed ? "Cho phép" : "Bị hạn chế"}
              </Badge>
            </div>
          )
        })}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Giao diện chỉ hiển thị quyền từ API. Backend phải tự xác thực quyền cho
        từng thao tác.
      </p>
    </section>
  )
}

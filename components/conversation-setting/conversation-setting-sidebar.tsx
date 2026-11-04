import { ConversationSettingTab } from "@/utils/conversation.util"
import { Settings2, Shield, Users } from "lucide-react"

export const conversationSettingSections: {
  value: ConversationSettingTab
  label: string
  icon: typeof Settings2
}[] = [
  { value: "overview", label: "Tổng quan", icon: Settings2 },
  { value: "members", label: "Thành viên", icon: Users },
  { value: "permissions", label: "Quyền hạn", icon: Shield },
]

type Props = {
  value: ConversationSettingTab
  onChange: (value: ConversationSettingTab) => void
  memberCount: number
}

export function ConversationSettingSidebar({
  value,
  onChange,
  memberCount,
}: Props) {
  return (
    <nav
      aria-label="Cài đặt server"
      className="flex flex-1 flex-col gap-1 overflow-y-auto p-2 sm:p-3"
    >
      {conversationSettingSections.map(
        ({ value: section, label, icon: Icon }) => {
          const active = value === section

          return (
            <button
              key={section}
              type="button"
              onClick={() => onChange(section)}
              aria-current={active ? "page" : undefined}
              title={label}
              className={`flex h-10 w-full items-center justify-center gap-3 rounded-lg px-0 text-sm transition-colors sm:justify-start sm:px-3 ${
                active
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span className="hidden flex-1 truncate text-left sm:block">
                {label}
              </span>

              {section === "members" && (
                <span className="hidden rounded-md bg-muted px-1.5 py-0.5 text-xs text-foreground sm:block">
                  {memberCount}
                </span>
              )}
            </button>
          )
        }
      )}
    </nav>
  )
}

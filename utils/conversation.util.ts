import type {
  ConversationListItem,
  ConversationMember,
  ConversationPermission,
} from "@/types/conversation.type"

/** Người còn lại trong chat direct */
export function getPeer(
  c: ConversationListItem,
  meId?: string
): ConversationMember | null {
  if (c.type !== "direct") return null
  return c.members.find((m) => m.userId !== meId) ?? null
}

export function getConversationTitle(c: ConversationListItem, meId?: string) {
  if (c.type === "group") return c.name?.trim() || "Nhóm chưa đặt tên"
  return getPeer(c, meId)?.displayName ?? "Người dùng"
}

export function getLastActivity(c: ConversationListItem) {
  return new Date(c.lastMessage?.createdAt ?? c.updatedAt)
}

export function isMuted(c: ConversationListItem) {
  return !!c.me.mutedUntil && new Date(c.me.mutedUntil).getTime() > Date.now()
}

/** OWNER làm được mọi thứ; ADMIN chỉ làm được các quyền OWNER đã cấp; direct không có quyền quản trị. */
export function can(
  c: ConversationListItem,
  permission: ConversationPermission
) {
  if (c.type !== "group") return false
  if (c.me.role === "owner") return true
  return c.me.role === "admin" && c.adminPermissions.includes(permission)
}

export function formatActivityTime(date: Date) {
  const now = new Date()
  const sameDay = date.toDateString() === now.toDateString()
  if (sameDay) {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
}

export interface ConversationSection {
  key: string
  label: string
  items: ConversationListItem[]
}

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

/** Ghim lên đầu, phần còn lại chia theo mốc thời gian của hoạt động gần nhất. */
export function groupByTime(
  list: ConversationListItem[]
): ConversationSection[] {
  const sorted = [...list].sort(
    (a, b) => getLastActivity(b).getTime() - getLastActivity(a).getTime()
  )

  const sections: ConversationSection[] = [
    { key: "pinned", label: "Đã ghim", items: [] },
    { key: "today", label: "Hôm nay", items: [] },
    { key: "yesterday", label: "Hôm qua", items: [] },
    { key: "week", label: "7 ngày qua", items: [] },
    { key: "month", label: "30 ngày qua", items: [] },
    { key: "older", label: "Cũ hơn", items: [] },
  ]
  const by = Object.fromEntries(sections.map((s) => [s.key, s]))
  const today = startOfDay(new Date())
  const DAY = 86_400_000

  for (const c of sorted) {
    if (c.me.isPinned) {
      by.pinned.items.push(c)
      continue
    }
    const days = Math.round((today - startOfDay(getLastActivity(c))) / DAY)
    const key =
      days <= 0
        ? "today"
        : days === 1
          ? "yesterday"
          : days <= 7
            ? "week"
            : days <= 30
              ? "month"
              : "older"
    by[key].items.push(c)
  }
  return sections.filter((s) => s.items.length > 0)
}

export type ConversationSettingTab = "overview" | "members" | "permissions"

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024
export const AVATAR_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

export function getDisplayName(member: ConversationMember) {
  return member.displayName?.trim() || member.username
}

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

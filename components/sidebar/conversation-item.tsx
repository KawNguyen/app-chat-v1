"use client"

import {
  IconBell,
  IconBellOff,
  IconDots,
  IconLogout,
  IconPencil,
  IconPin,
  IconPinnedOff,
  IconTrash,
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  can,
  formatActivityTime,
  getConversationTitle,
  getLastActivity,
  getPeer,
  isMuted,
} from "@/utils/conversation.util"
import type { ConversationListItem } from "@/types/conversation.type"
import AvatarConversation from "../avatar-conversation"
import { useConversationPreference } from "@/hooks/conversation/mutations/conversation-preference.mutation"
import { useDeleteConversation } from "@/hooks/conversation/mutations/delete-conversation.mutation"

const MUTE_HOURS = 8

function getPreview(c: ConversationListItem, meId?: string) {
  const msg = c.lastMessage
  if (!msg) return "Chưa có tin nhắn"

  const isMine = msg.senderId === meId
  if (isMine) return `Bạn: ${msg.content}`

  if (c.type === "group") {
    const name =
      msg.senderName ??
      c.members.find((m) => m.userId === msg.senderId)?.displayName
    return name ? `${name}: ${msg.content}` : msg.content
  }
  return msg.content
}

export function ConversationItem({
  conversation: c,
  meId,
}: {
  conversation: ConversationListItem
  meId?: string
}) {
  const router = useRouter()
  const params = new URLSearchParams(location.search)
  const { mutate: updateMine } = useConversationPreference(c.id)

  const activeId = params.get("convId") || undefined
  const isGroup = c.type === "group"
  const { role, isPinned, unreadCount } = c.me
  const muted = isMuted(c)
  const title = getConversationTitle(c, meId)
  const avatarUrl = isGroup ? c.avatarUrl : getPeer(c, meId)?.avatarUrl
  const preview = getPreview(c, meId)
  const hasUnread = unreadCount > 0 && !muted

  const toggleMute = () =>
    updateMine({
      mutedUntil: muted
        ? null
        : new Date(Date.now() + MUTE_HOURS * 3_600_000).toISOString(),
    })

  const removeConversation = useDeleteConversation()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={activeId === c.id}
        onClick={() => {
          router.push(`/conversation/${c.id}`)
        }}
        tooltip={title}
        className="h-auto items-start gap-3 py-2"
      >
        <AvatarConversation avatarUrl={avatarUrl || undefined} title={title} />

        <div className="grid min-w-0 flex-1 gap-0.5 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-1.5">
            <span
              className={`truncate text-sm ${hasUnread ? "font-semibold" : "font-medium"}`}
            >
              {title}
            </span>
            {isPinned && (
              <IconPin className="size-3 shrink-0 text-muted-foreground" />
            )}
            {muted && (
              <IconBellOff className="size-3 shrink-0 text-muted-foreground" />
            )}
          </div>
          <span
            className={`truncate text-xs ${hasUnread ? "text-foreground" : "text-muted-foreground"}`}
          >
            {preview}
          </span>
        </div>

        <span className="shrink-0 pt-0.5 text-xs text-muted-foreground tabular-nums group-data-[collapsible=icon]:hidden">
          {formatActivityTime(getLastActivity(c))}
        </span>
      </SidebarMenuButton>

      {hasUnread && (
        <SidebarMenuBadge className="top-auto right-2 bottom-2 rounded-full bg-primary px-1.5 text-primary-foreground peer-hover/menu-button:hidden">
          {unreadCount > 99 ? "99+" : unreadCount}
        </SidebarMenuBadge>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuAction
              showOnHover
              className="top-auto right-1.5 bottom-1.5"
            />
          }
        >
          <IconDots />
          <span className="sr-only">Tuỳ chọn</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" align="start" className="w-52">
          <DropdownMenuItem onClick={() => updateMine({ isPinned: !isPinned })}>
            {isPinned ? <IconPinnedOff /> : <IconPin />}
            {isPinned ? "Bỏ ghim" : "Ghim cuộc trò chuyện"}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={toggleMute}>
            {muted ? <IconBell /> : <IconBellOff />}
            {muted ? "Bật thông báo" : `Tắt thông báo ${MUTE_HOURS} giờ`}
          </DropdownMenuItem>

          {can(c, "rename_group") && (
            <DropdownMenuItem onClick={() => {}}>
              <IconPencil />
              Đổi tên nhóm
            </DropdownMenuItem>
          )}

          {isGroup && <DropdownMenuSeparator />}

          {isGroup && role !== "owner" && (
            <DropdownMenuItem variant="destructive" onClick={() => {}}>
              <IconLogout />
              Rời nhóm
            </DropdownMenuItem>
          )}

          {isGroup && role === "owner" && (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => removeConversation.mutate(c.id)}
            >
              <IconTrash />
              Xoá nhóm
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

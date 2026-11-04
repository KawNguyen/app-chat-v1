"use client"

import { IconPlus, IconUserPlus, IconUsersPlus } from "@tabler/icons-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInput,
  SidebarMenu,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar"
import { useMe } from "@/hooks/auth/queries/auth.query"
import { useConversations } from "@/hooks/conversation/queries/conversation.query"
import { useConversationStore } from "@/stores/conversation.store"
import { getConversationTitle, groupByTime } from "@/utils/conversation.util"
import { ConversationItem } from "./conversation-item"
import type { ConversationListItem } from "@/types/conversation.type"
import FriendDialog from "./friend-dialog"

export function NavConversations() {
  const { data: me } = useMe()
  const { data: convs, isPending, isError, refetch } = useConversations()

  const search = useConversationStore((s) => s.search)
  const setSearch = useConversationStore((s) => s.setSearch)
  const openCreate = useConversationStore((s) => s.openCreate)

  const [friendOpen, setFriendOpen] = useState(false)

  const sections = useMemo(() => {
    const q = search.trim().toLowerCase()
    const data = convs?.items

    if (!Array.isArray(data)) {
      return groupByTime([])
    }

    const list = data.filter((c: ConversationListItem) => {
      return !q || getConversationTitle(c).toLowerCase().includes(q)
    })

    return groupByTime(list)
  }, [convs?.items, search])

  return (
    <>
      <SidebarGroup className="pb-0 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-1">
          <SidebarInput
            placeholder="Tìm cuộc trò chuyện"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 shrink-0"
                  aria-label="Thêm"
                  title="Thêm bạn / Tạo nhóm"
                />
              }
            >
              <IconPlus className="size-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => setFriendOpen(true)}>
                <IconUserPlus />
                Thêm bạn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openCreate}>
                <IconUsersPlus />
                Tạo nhóm mới
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarGroup>

      {isPending && (
        <SidebarGroup>
          <SidebarMenu>
            {Array.from({ length: 6 }, (_, i) => (
              <SidebarMenuSkeleton key={i} showIcon />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      )}

      {isError && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <p className="px-2 text-sm text-muted-foreground">
            Không tải được cuộc trò chuyện.{" "}
            <button
              type="button"
              className="underline"
              onClick={() => refetch()}
            >
              Tải lại
            </button>
          </p>
        </SidebarGroup>
      )}

      {!isPending && !isError && sections.length === 0 && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <p className="px-2 text-sm text-muted-foreground">
            {search.trim()
              ? `Không có kết quả cho “${search}”.`
              : "Chưa có cuộc trò chuyện nào."}{" "}
            {!search.trim() && (
              <button type="button" className="underline" onClick={openCreate}>
                Tạo nhóm đầu tiên
              </button>
            )}
          </p>
        </SidebarGroup>
      )}

      {!isPending &&
        !isError &&
        sections.map((section) => (
          <SidebarGroup key={section.key}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((c) => (
                  <ConversationItem key={c.id} conversation={c} meId={me?.id} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

      {/* Nằm ngoài DropdownMenuContent để không bị unmount khi menu đóng */}
      <FriendDialog open={friendOpen} onOpenChange={setFriendOpen} />
    </>
  )
}

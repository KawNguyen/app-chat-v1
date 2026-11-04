"use client"

import { useState } from "react"
import { Settings } from "lucide-react"

import { useConversation } from "@/hooks/conversation/queries/conversation.query"
import { Button } from "@/components/ui/button"
import { getConversationTitle, getPeer } from "@/utils/conversation.util"
import AvatarConversation from "../avatar-conversation"
import { ConversationSettingDialog } from "../conversation-setting/conversation-setting-dialog"

type Props = {
  convId: string
  meId?: string
}

export function SiteHeader({ convId, meId }: Props) {
  const { data: conversation } = useConversation(convId)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const isGroup = conversation?.type === "group"
  const title = conversation ? getConversationTitle(conversation, meId) : ""
  const rawAvatar = conversation
    ? isGroup
      ? conversation.avatarUrl
      : (getPeer(conversation, meId)?.avatarUrl ?? null)
    : null

  return (
    <>
      <header className="flex h-(--header-height) shrink-0 items-center justify-between gap-2 border-b">
        <div className="flex w-full items-center gap-2 px-4">
          <AvatarConversation avatarUrl={rawAvatar} title={title} />

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm leading-none font-medium">
              {title}
            </h1>
          </div>

          {isGroup && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Cài đặt server"
              title="Cài đặt server"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="size-4" />
            </Button>
          )}
        </div>
      </header>

      {conversation && isGroup && (
        <ConversationSettingDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          conversation={conversation}
        />
      )}
    </>
  )
}

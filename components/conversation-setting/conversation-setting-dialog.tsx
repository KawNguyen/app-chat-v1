"use client"

import { useCallback, useEffect, useState } from "react"
import { X } from "lucide-react"

import { ConversationSettingHeader } from "./conversation-setting-header"
import {
  ConversationSettingSidebar,
  conversationSettingSections,
} from "./conversation-setting-sidebar"
import { ConversationSettingOverview } from "./conversation-setting-overview"
import { ConversationSettingMembers } from "./conversation-setting-members"
import { ConversationSettingPermissions } from "./conversation-setting-permissions"

import type { ConversationListItem } from "@/types/conversation.type"

import { useImageDraft } from "../image-picker"
import { can, ConversationSettingTab } from "@/utils/conversation.util"
import { useUpdateGroup } from "@/hooks/conversation/mutations/update-group.mutation"
import { useConversationPreference } from "@/hooks/conversation/mutations/conversation-preference.mutation"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversation: ConversationListItem
}

const MUTE_DURATION_MS = 8 * 60 * 60 * 1000

const MAX_TIMEOUT_MS = 2 ** 31 - 1

export function ConversationSettingDialog(props: Props) {
  if (!props.open) return null

  return (
    <ConversationSettingDialogContent key={props.conversation.id} {...props} />
  )
}

function ConversationSettingDialogContent({
  onOpenChange,
  conversation,
}: Props) {
  const convId = conversation.id

  const updateMutation = useUpdateGroup(convId)
  const updateMyMutation = useConversationPreference(convId)

  const [activeTab, setActiveTab] = useState<ConversationSettingTab>("overview")
  const [name, setName] = useState(conversation.name ?? "")
  const avatarPicker = useImageDraft()
  const [error, setError] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const isSaving = updateMutation.isPending
  const isSavingPin =
    updateMyMutation.isPending &&
    updateMyMutation.variables?.isPinned !== undefined
  const isSavingMute =
    updateMyMutation.isPending &&
    updateMyMutation.variables?.mutedUntil !== undefined

  const mutedUntil = conversation.me.mutedUntil

  const canRename = can(conversation, "rename_group")
  const canChangeAvatar = can(conversation, "change_avatar")

  const isMuted = mutedUntil !== null && new Date(mutedUntil).getTime() > now

  const nameChanged = canRename && name.trim() !== (conversation.name ?? "")
  const avatarChanged = canChangeAvatar && avatarPicker.isDirty
  const isDirty = nameChanged || avatarChanged

  const close = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [close])

  useEffect(() => {
    if (mutedUntil === null) return

    const remaining = new Date(mutedUntil).getTime() - Date.now()
    if (remaining <= 0) return

    const id = window.setTimeout(
      () => setNow(Date.now()),
      Math.min(remaining + 50, MAX_TIMEOUT_MS)
    )

    return () => window.clearTimeout(id)
  }, [mutedUntil])

  const handleReset = () => {
    setName(conversation.name ?? "")
    avatarPicker.reset()
    setError(null)
  }

  const handleSave = () => {
    const newName = name.trim()

    if (nameChanged && !newName) {
      setError("Tên server không được để trống.")
      return
    }

    setError(null)
    updateMutation.mutate(
      {
        name: nameChanged ? newName : undefined,
        avatar: avatarChanged ? avatarPicker.draft.file : undefined,
        removeAvatar:
          avatarChanged && avatarPicker.draft.removed ? true : undefined,
      },
      { onSuccess: () => avatarPicker.reset() }
    )
  }

  const handleTogglePin = () => {
    updateMyMutation.mutate({ isPinned: !conversation.me.isPinned })
  }

  const handleToggleMute = () => {
    updateMyMutation.mutate({
      mutedUntil: isMuted
        ? null
        : new Date(Date.now() + MUTE_DURATION_MS).toISOString(),
    })
  }

  const activeLabel =
    conversationSettingSections.find((s) => s.value === activeTab)?.label ?? ""

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="conversation-setting-title"
        className="flex h-160 max-h-[calc(100dvh-1.5rem)] w-225 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border bg-background text-foreground shadow-2xl"
      >
        {/* Sidebar (rộng cố định) */}
        <aside className="flex w-16 shrink-0 flex-col border-r bg-muted/30 sm:w-60">
          <ConversationSettingHeader
            name={conversation.name}
            avatarUrl={conversation.avatarUrl}
            titleId="conversation-setting-title"
          />

          <ConversationSettingSidebar
            value={activeTab}
            onChange={setActiveTab}
            memberCount={conversation.members.length}
          />
        </aside>

        {/* Nội dung */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b px-5 sm:px-6">
            <h3 className="truncate text-base font-semibold">{activeLabel}</h3>

            <button
              type="button"
              onClick={close}
              aria-label="Đóng cài đặt"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6">
            {activeTab === "overview" && (
              <ConversationSettingOverview
                conversation={conversation}
                name={name}
                onNameChange={(value) => {
                  setName(value)
                  setError(null)
                }}
                picker={avatarPicker}
                onImageError={setError}
                canRename={canRename}
                canChangeAvatar={canChangeAvatar}
                isSaving={isSaving}
                isDirty={isDirty}
                onSave={handleSave}
                onReset={handleReset}
                isSavingPin={isSavingPin}
                isSavingMute={isSavingMute}
                isMuted={isMuted}
                onTogglePin={handleTogglePin}
                onToggleMute={handleToggleMute}
              />
            )}

            {activeTab === "members" && (
              <ConversationSettingMembers members={conversation.members} />
            )}

            {activeTab === "permissions" && (
              <ConversationSettingPermissions conversation={conversation} />
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="shrink-0 border-t border-destructive/20 bg-destructive/5 px-5 py-3 text-sm text-destructive sm:px-6"
            >
              {error}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

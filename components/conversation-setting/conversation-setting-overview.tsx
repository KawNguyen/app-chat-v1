import { CalendarDays, Loader2, Users } from "lucide-react"

import type { ConversationListItem } from "@/types/conversation.type"
import { ConversationSettingPersonal } from "./conversation-setting-personal"
import { ImageDraftController, ImagePicker } from "../image-picker"
import { resolveAssetUrl } from "@/lib/utils"
import { formatDate } from "@/utils/conversation.util"

type Props = {
  conversation: ConversationListItem
  // Form chỉnh sửa (tên + ảnh)
  name: string
  onNameChange: (value: string) => void
  picker: ImageDraftController
  onImageError: (message: string | null) => void
  canRename: boolean
  canChangeAvatar: boolean
  isSaving: boolean
  isDirty: boolean
  onSave: () => void
  onReset: () => void
  // Cài đặt cá nhân
  isSavingPin: boolean
  isSavingMute: boolean
  isMuted: boolean
  onTogglePin: () => void
  onToggleMute: () => void
}

export function ConversationSettingOverview({
  conversation,
  name,
  onNameChange,
  picker,
  onImageError,
  canRename,
  canChangeAvatar,
  isSaving,
  isDirty,
  onSave,
  onReset,
  isSavingPin,
  isSavingMute,
  isMuted,
  onTogglePin,
  onToggleMute,
}: Props) {
  const canEdit = canRename || canChangeAvatar
  const currentName = conversation.name?.trim() || "Server chưa có tên"

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="font-semibold">Thông tin server</h3>

        <form
          className="rounded-xl border p-4"
          onSubmit={(event) => {
            event.preventDefault()
            onSave()
          }}
        >
          <ImagePicker
            picker={picker}
            currentUrl={resolveAssetUrl(conversation.avatarUrl)}
            alt={currentName}
            fallback={name.at(0)?.toUpperCase() ?? "?"}
            editable={canChangeAvatar}
            disabled={isSaving}
            onError={onImageError}
          />

          <div className="mt-5">
            <label htmlFor="server-name" className="text-sm font-medium">
              Tên server
            </label>
            <p className="mt-1 text-sm text-muted-foreground">
              Tên hiển thị của nhóm chat.
            </p>
            <input
              id="server-name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              maxLength={100}
              disabled={!canRename || isSaving}
              placeholder="Nhập tên server"
              className="mt-3 h-10 w-full rounded-md border border-input bg-background px-3 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {canEdit ? (
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onReset}
                disabled={!isDirty || isSaving}
                className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Hủy thay đổi
              </button>

              <button
                type="submit"
                disabled={!isDirty || isSaving}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving && <Loader2 className="size-4 animate-spin" />}
                Lưu thay đổi
              </button>
            </div>
          ) : (
            <p className="mt-4 text-xs text-muted-foreground">
              Bạn không có quyền chỉnh sửa thông tin server.
            </p>
          )}
        </form>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border p-4">
            <Users className="size-4 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Thành viên</p>
            <p className="mt-1 text-2xl font-semibold">
              {conversation.members.length}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <CalendarDays className="size-4 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Ngày tạo</p>
            <p className="mt-1 text-sm font-semibold">
              {formatDate(conversation.createdAt)}
            </p>
          </div>
        </div>
      </section>

      <div className="border-t" />

      <ConversationSettingPersonal
        isPinned={conversation.me.isPinned}
        isMuted={isMuted}
        mutedUntil={conversation.me.mutedUntil}
        isSavingPin={isSavingPin}
        isSavingMute={isSavingMute}
        onTogglePin={onTogglePin}
        onToggleMute={onToggleMute}
      />
    </div>
  )
}

import { Bell, BellOff, Loader2, Pin, PinOff } from "lucide-react"

type Props = {
  isPinned: boolean
  isMuted: boolean
  mutedUntil: string | null
  isSavingPin: boolean
  isSavingMute: boolean
  onTogglePin: () => void
  onToggleMute: () => void
}

function SettingRow({
  icon: Icon,
  title,
  description,
  loading,
  disabled,
  onClick,
}: {
  icon: typeof Pin
  title: string
  description: string
  loading: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {loading && <Loader2 className="size-4 animate-spin" />}
    </button>
  )
}

export function ConversationSettingPersonal({
  isPinned,
  isMuted,
  mutedUntil,
  isSavingPin,
  isSavingMute,
  onTogglePin,
  onToggleMute,
}: Props) {
  const muteDescription =
    isMuted && mutedUntil
      ? `Tắt đến ${new Date(mutedUntil).toLocaleString("vi-VN")}`
      : "Tắt thông báo cho cuộc trò chuyện này."

  return (
    <section className="space-y-3">
      <div>
        <h3 className="font-semibold">Cài đặt cá nhân</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Chỉ ảnh hưởng đến tài khoản của bạn.
        </p>
      </div>

      <SettingRow
        icon={isPinned ? PinOff : Pin}
        title={isPinned ? "Bỏ ghim server" : "Ghim server"}
        description={
          isPinned
            ? "Bỏ ghim khỏi danh sách trò chuyện."
            : "Ưu tiên server trong danh sách trò chuyện."
        }
        loading={isSavingPin}
        disabled={isSavingPin}
        onClick={onTogglePin}
      />

      <SettingRow
        icon={isMuted ? Bell : BellOff}
        title={isMuted ? "Bật lại thông báo" : "Tắt thông báo"}
        description={
          isMuted ? muteDescription : "Không nhận thông báo từ server."
        }
        loading={isSavingMute}
        disabled={isSavingMute}
        onClick={onToggleMute}
      />
    </section>
  )
}

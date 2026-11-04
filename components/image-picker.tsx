"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { ImagePlus, Undo2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const IMAGE_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
export const IMAGE_MAX_BYTES = 2 * 1024 * 1024

export type ImageDraft = {
  file: File | null // ảnh mới vừa chọn
  preview: string | null // blob URL của ảnh mới
  removed: boolean // đã bấm xoá ảnh hiện tại, chưa lưu
}

const EMPTY: ImageDraft = { file: null, preview: null, removed: false }

type Options = {
  maxBytes?: number
  allowedTypes?: string[]
}

/** Giữ trạng thái ảnh nháp. Blob URL được tự giải phóng khi đổi ảnh hoặc unmount. */
export function useImageDraft({
  maxBytes = IMAGE_MAX_BYTES,
  allowedTypes = IMAGE_ALLOWED_TYPES,
}: Options = {}) {
  const [draft, setDraft] = useState<ImageDraft>(EMPTY)
  const previewRef = useRef<string | null>(null)

  const revokePreview = () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    previewRef.current = null
  }

  // Dọn blob URL khi component unmount (ví dụ đóng dialog)
  useEffect(() => revokePreview, [])

  /** Trả về thông báo lỗi nếu file không hợp lệ, ngược lại trả về null. */
  const pick = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return "Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP."
    }
    if (file.size > maxBytes) {
      return `Ảnh không được lớn hơn ${Math.round(maxBytes / 1024 / 1024)}MB.`
    }
    revokePreview()
    const preview = URL.createObjectURL(file)
    previewRef.current = preview
    setDraft({ file, preview, removed: false })
    return null
  }

  const remove = () => {
    if (draft.file) {
      // Đang có ảnh mới chọn: bỏ ảnh đó, quay về ảnh hiện tại
      revokePreview()
      setDraft(EMPTY)
    } else {
      setDraft({ ...EMPTY, removed: true })
    }
  }

  const undo = () => setDraft((d) => ({ ...d, removed: false }))

  const reset = () => {
    revokePreview()
    setDraft(EMPTY)
  }

  return {
    draft,
    isDirty: !!draft.file || draft.removed,
    pick,
    remove,
    undo,
    reset,
  }
}

export type ImageDraftController = ReturnType<typeof useImageDraft>

type Props = {
  picker: ImageDraftController
  /** URL ảnh hiện tại đã ghép base URL (xem resolveAssetUrl) */
  currentUrl?: string
  alt: string
  fallback: ReactNode
  /** false → chỉ hiển thị ảnh, không có nút chỉnh sửa */
  editable?: boolean
  disabled?: boolean
  label?: string
  hint?: string
  /** Nhận thông báo lỗi khi chọn file sai, hoặc null khi chọn thành công */
  onError?: (message: string | null) => void
  avatarClassName?: string
}

export function ImagePicker({
  picker,
  currentUrl,
  alt,
  fallback,
  editable = true,
  disabled = false,
  label = "Ảnh đại diện",
  hint = "JPEG, PNG hoặc WebP, tối đa 2MB.",
  onError,
  avatarClassName = "size-20",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { draft } = picker

  const hasImage = !!draft.preview || (!!currentUrl && !draft.removed)
  const src = draft.removed ? undefined : (draft.preview ?? currentUrl)

  return (
    <div className="flex items-center gap-4">
      <Avatar className={`shrink-0 ${avatarClassName}`}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {fallback}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>

        {editable && (
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              ref={inputRef}
              type="file"
              accept={IMAGE_ALLOWED_TYPES.join(",")}
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) onError?.(picker.pick(file))
                event.target.value = ""
              }}
            />

            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ImagePlus className="size-3.5" />
              {hasImage ? "Đổi ảnh" : "Chọn ảnh"}
            </button>

            {hasImage && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  onError?.(null)
                  picker.remove()
                }}
                className="inline-flex h-8 items-center rounded-md px-3 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Xoá ảnh
              </button>
            )}

            {draft.removed && (
              <button
                type="button"
                disabled={disabled}
                onClick={picker.undo}
                className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Undo2 className="size-3.5" />
                Hoàn tác
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

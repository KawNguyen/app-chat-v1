"use client"

import { KeyboardEvent, useEffect, useRef, useState } from "react"
import { IconPaperclip, IconSend } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { useMe } from "@/hooks/auth/queries/auth.query"
import { useMessage } from "@/hooks/message/queries/message.query"
import { MessageScrollerScreen } from "./message-scroller"
import { useSendMessage } from "@/hooks/message/mutations/send-message.mutation"

const MAX_INPUT_HEIGHT = 160

export function ChatPanel({ convId }: { convId: string }) {
  const [draft, setDraft] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { data: messages } = useMessage(convId)
  const { data: me } = useMe()
  const sendMessage = useSendMessage(convId)

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, MAX_INPUT_HEIGHT)}px`
  }, [draft])

  const canSend = draft.trim().length > 0 && !sendMessage.isPending

  function submit() {
    const content = draft.trim()
    if (!content || sendMessage.isPending) return
    sendMessage.mutate(content, {
      onSuccess: () => {
        setDraft("")
      },
    })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <MessageScrollerScreen
        messages={messages?.items ?? []}
        currentUserId={me?.id}
      />

      <form
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
        className="bg-background px-4 pt-2 pb-4"
      >
        <div className="flex w-full items-center gap-1 rounded-2xl border bg-muted/40 p-1.5 transition-colors focus-within:border-ring focus-within:bg-background">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Đính kèm tệp"
            className="shrink-0 rounded-xl"
            disabled
          >
            <IconPaperclip />
          </Button>

          <textarea
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Nhập tin nhắn..."
            aria-label="Tin nhắn"
            className="max-h-40 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-5 outline-none placeholder:text-muted-foreground"
          />

          <Button
            type="submit"
            size="icon"
            aria-label="Gửi tin nhắn"
            className="shrink-0 rounded-xl"
            disabled={!canSend}
          >
            <IconSend />
          </Button>
        </div>

        {sendMessage.isError && (
          <p
            className="mx-auto mt-2 w-full max-w-3xl text-xs text-destructive"
            role="alert"
          >
            Không gửi được tin nhắn. Kiểm tra kết nối rồi thử lại.
          </p>
        )}
      </form>
    </main>
  )
}

"use client"

import { Fragment, useMemo } from "react"

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "../ui/message-scroller"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "../ui/message"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Bubble, BubbleContent } from "../ui/bubble"
import { cn } from "@/lib/utils"
import type { Message as MessageType } from "@/types/message.type"

const GROUP_GAP_MS = 5 * 60 * 1000

function getInitials(displayName: string | null, username: string) {
  const name = displayName?.trim() || username
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function formatMessageTime(createdAt: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt))
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatDayLabel(createdAt: string) {
  const date = new Date(createdAt)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (isSameDay(date, today)) return "Hôm nay"
  if (isSameDay(date, yesterday)) return "Hôm qua"
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function DaySeparator({ createdAt }: { createdAt: string }) {
  return (
    <MessageScrollerItem className="mt-5 mb-1 first:mt-0">
      <div
        role="separator"
        className="flex items-center gap-3 text-xs text-muted-foreground"
      >
        <span className="h-px flex-1 bg-border" />
        <span>{formatDayLabel(createdAt)}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    </MessageScrollerItem>
  )
}

export function MessageScrollerScreen({
  messages: rawMessages,
  currentUserId,
}: {
  messages: MessageType[]
  currentUserId?: string
}) {
  const messages = useMemo(
    () =>
      [...rawMessages].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() ||
          a.id.localeCompare(b.id)
      ),
    [rawMessages]
  )

  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <MessageScroller className="min-h-0 flex-1">
        <MessageScrollerViewport>
          <MessageScrollerContent className="min-h-full w-full justify-end px-4 py-4">
            {messages.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-1 py-12 text-center">
                <p className="text-sm font-medium">Chưa có tin nhắn nào</p>
                <p className="text-sm text-muted-foreground">
                  Hãy gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện.
                </p>
              </div>
            ) : (
              messages.map((message, index) => {
                const prev = messages[index - 1]
                const next = messages[index + 1]
                const current = new Date(message.createdAt)

                const startsDay =
                  !prev || !isSameDay(new Date(prev.createdAt), current)
                const startsGroup =
                  startsDay ||
                  prev.senderId !== message.senderId ||
                  current.getTime() - new Date(prev.createdAt).getTime() >
                    GROUP_GAP_MS
                const endsGroup =
                  !next ||
                  !isSameDay(current, new Date(next.createdAt)) ||
                  next.senderId !== message.senderId ||
                  new Date(next.createdAt).getTime() - current.getTime() >
                    GROUP_GAP_MS

                const isMine = message.senderId === currentUserId
                const isDeleted = Boolean(message.deletedAt)
                const senderName =
                  message.sender.displayName || message.sender.username

                return (
                  <Fragment key={message.id}>
                    {startsDay && (
                      <DaySeparator createdAt={message.createdAt} />
                    )}
                    <MessageScrollerItem
                      messageId={message.id}
                      className={cn(
                        !startsDay && (startsGroup ? "mt-4" : "mt-1")
                      )}
                    >
                      <Message align={isMine ? "end" : "start"}>
                        {!isMine && (
                          <MessageAvatar>
                            {endsGroup && (
                              <Avatar>
                                <AvatarImage
                                  src={message.sender.avatarUrl ?? undefined}
                                  alt={senderName}
                                />
                                <AvatarFallback>
                                  {getInitials(
                                    message.sender.displayName,
                                    message.sender.username
                                  )}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </MessageAvatar>
                        )}
                        <MessageContent>
                          {!isMine && startsGroup && (
                            <MessageHeader>{senderName}</MessageHeader>
                          )}
                          <Bubble
                            variant={isMine && !isDeleted ? "default" : "muted"}
                            className={cn(
                              isMine && !startsGroup && "rounded-tr-md",
                              isMine && !endsGroup && "rounded-br-md",
                              !isMine && !startsGroup && "rounded-tl-md",
                              !isMine && !endsGroup && "rounded-bl-md"
                            )}
                          >
                            <BubbleContent
                              className={cn(
                                "wrap-break-word whitespace-pre-wrap",
                                isDeleted && "text-muted-foreground italic"
                              )}
                            >
                              {isDeleted
                                ? "Tin nhắn đã được thu hồi"
                                : message.content}
                            </BubbleContent>
                          </Bubble>
                          {endsGroup && (
                            <MessageFooter>
                              {formatMessageTime(message.createdAt)}
                              {message.editedAt && " · đã chỉnh sửa"}
                            </MessageFooter>
                          )}
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  </Fragment>
                )
              })
            )}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}

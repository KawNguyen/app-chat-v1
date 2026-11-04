"use client"

import { useState } from "react"
import {
  UserPlus,
  Search,
  UserRoundPlus,
  Loader2,
  Check,
  X,
  UserMinus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useDebounce } from "@/hooks/use-debounce"
import { useGetUsers } from "@/hooks/user/queries/user.query"
import { UserListItem } from "@/types/user.type"
import { useSendFriendRequest } from "@/hooks/friend/mutations/send-friend-request.mutation"
import { useCancelFriendRequest } from "@/hooks/friend/mutations/cancel-friend-request.mutation"
import { useUnfriend } from "@/hooks/friend/mutations/unfriend.mutation"
import { useRejectFriendRequest } from "@/hooks/friend/mutations/reject-friend-request.muation"

function FriendActions({
  user,
  search,
}: {
  user: UserListItem
  search: string
}) {
  const send = useSendFriendRequest(search)
  const cancel = useCancelFriendRequest(search)
  const reject = useRejectFriendRequest(search)
  const unfriend = useUnfriend(search)

  const busy =
    send.isPending || cancel.isPending || reject.isPending || unfriend.isPending

  const spinner = <Loader2 className="size-4 animate-spin" />

  if (user.isFriend) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="shrink-0"
        disabled={busy}
        onClick={() => unfriend.mutate(user.friendshipId!)}
      >
        {unfriend.isPending ? spinner : <UserMinus className="size-4" />}
        Hủy kết bạn
      </Button>
    )
  }

  if (user.friendshipStatus === "pending") {
    if (user.friendshipDirection === "incoming") {
      return (
        <div className="flex shrink-0 gap-1">
          <Button size="sm" disabled={busy} onClick={() => {}}>
            <Check className="size-4" />
            Chấp nhận
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => reject.mutate(user.friendshipId!)}
          >
            {reject.isPending ? spinner : <X className="size-4" />}
            Từ chối
          </Button>
        </div>
      )
    }

    return (
      <Button
        size="sm"
        variant="outline"
        className="shrink-0"
        disabled={busy}
        onClick={() => cancel.mutate(user.friendshipId!)}
      >
        {cancel.isPending ? spinner : <X className="size-4" />}
        Hủy yêu cầu
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="shrink-0"
      disabled={busy}
      onClick={() => send.mutate(user.id)}
    >
      {send.isPending ? spinner : <UserPlus className="size-4" />}
      Thêm bạn
    </Button>
  )
}

type FriendDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function FriendDialog({
  open,
  onOpenChange,
}: FriendDialogProps) {
  const [search, setSearch] = useState("")

  const debouncedSearch = useDebounce(search, 350)

  const { data, isPending, isFetching } = useGetUsers({
    search: debouncedSearch,
  })

  const users = data?.items ?? []

  const isSearching = search.trim().length > 0
  const isDebouncing = search !== debouncedSearch

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSearch("")
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm bạn bè</DialogTitle>
          <DialogDescription>
            Tìm kiếm bạn bè bằng tên người dùng hoặc tên hiển thị của họ.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm theo tên..."
                className="pr-9 pl-9"
              />

              {isSearching && (isDebouncing || isFetching) && (
                <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
          </Field>
        </FieldGroup>

        <div className="max-h-80 min-h-32 overflow-y-auto">
          {!isSearching ? (
            <div className="flex min-h-32 flex-col items-center justify-center gap-2 text-center">
              <Search className="size-8 text-muted-foreground/50" />

              <p className="text-sm text-muted-foreground">
                Nhập tên người dùng để tìm kiếm bạn bè.
              </p>
            </div>
          ) : isDebouncing || (isPending && users.length === 0) ? (
            <div className="flex min-h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Đang tìm kiếm...
            </div>
          ) : users.length === 0 ? (
            <div className="flex min-h-32 flex-col items-center justify-center gap-2 text-center">
              <UserRoundPlus className="size-8 text-muted-foreground/50" />

              <p className="text-sm font-medium">Không tìm thấy người dùng</p>

              <p className="text-xs text-muted-foreground">
                Thử tìm kiếm bằng tên khác.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {users.map((user: UserListItem) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                >
                  <Avatar className="size-10">
                    <AvatarImage
                      src={user.avatarUrl ?? undefined}
                      alt={user.displayName ?? user.username}
                    />

                    <AvatarFallback>
                      {(user.displayName ?? user.username)
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {user.displayName || user.username}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>

                  <FriendActions user={user} search={debouncedSearch} />
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Đóng</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

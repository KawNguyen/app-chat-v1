"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useConversationStore } from "@/stores/conversation.store"
import { UserListItem } from "@/types/user.type"
import { useGetUsers } from "@/hooks/user/queries/user.query"
import { useDebounce } from "@/hooks/use-debounce"
import { useCreateGroup } from "@/hooks/conversation/mutations/create-group.mutation"

const MIN_FRIENDS = 2

export function CreateGroupDialog() {
  const open = useConversationStore((s) => s.createOpen)
  const close = useConversationStore((s) => s.closeCreate)
  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      {open && <CreateGroupForm onClose={close} />}
    </Dialog>
  )
}

function CreateGroupForm({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [search, setSearch] = useState("")

  const debouncedSearch = useDebounce(search, 350)

  const { data: users, isPending } = useGetUsers({
    search: debouncedSearch,
  })
  const { mutate, isPending: creating } = useCreateGroup()

  const [name, setName] = useState("")
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    )

  const canSubmit = name.trim().length > 0 && selected.length >= MIN_FRIENDS

  const submit = () =>
    mutate(
      { name: name.trim(), memberIds: selected },
      {
        onSuccess: (c) => {
          router.push(`/conversation/${c.data.id}`)
          onClose()
        },
      }
    )

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Tạo nhóm mới</DialogTitle>
        <DialogDescription>
          Chọn ít nhất {MIN_FRIENDS} người bạn. Bạn sẽ là trưởng nhóm.
        </DialogDescription>
      </DialogHeader>

      <Input
        autoFocus
        placeholder="Tên nhóm"
        maxLength={100}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Tìm bạn bè"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ScrollArea className="h-56 rounded-md border">
        <ul className="p-1">
          {isPending && (
            <li className="p-3 text-sm text-muted-foreground">
              Đang tải danh sách bạn bè…
            </li>
          )}
          {!isPending && users.items.length === 0 && (
            <li className="p-3 text-sm text-muted-foreground">
              Bạn chưa có bạn bè nào. Kết bạn trước để thêm vào nhóm.
            </li>
          )}
          {!isPending && users.items.length > 0 && users.items.length === 0 && (
            <li className="p-3 text-sm text-muted-foreground">
              Không tìm thấy “{debouncedSearch}”.
            </li>
          )}
          {users?.items.map((f: UserListItem) => (
            <li key={f.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-accent">
                <Checkbox
                  checked={selected.includes(f.id)}
                  onCheckedChange={() => toggle(f.id)}
                />
                <Avatar className="size-7">
                  {f.avatarUrl && <AvatarImage src={f.avatarUrl} alt="" />}
                  <AvatarFallback>
                    {(f.displayName ?? f.username)?.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-sm">
                  {f.displayName || f.username}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </ScrollArea>

      <DialogFooter className="items-center sm:justify-between">
        <span className="text-sm text-muted-foreground">
          Đã chọn {selected.length}
        </span>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button
            type="button"
            disabled={!canSubmit || creating}
            onClick={submit}
          >
            Tạo nhóm
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  )
}

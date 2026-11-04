import { ConversationListItem } from "@/types/conversation.type"
import { create } from "zustand"

type DialogState = {
  type: "rename" | "delete" | "leave"
  conversation: ConversationListItem
} | null

interface ConversationUIState {
  activeId: string | null
  search: string
  createOpen: boolean
  dialog: DialogState

  setActiveId: (id: string | null) => void
  setSearch: (value: string) => void
  openCreate: () => void
  closeCreate: () => void
  openDialog: (
    type: "rename" | "delete" | "leave",
    conversation: ConversationListItem
  ) => void
  closeDialog: () => void
}

/** Zustand chỉ giữ UI state. Dữ liệu từ server (danh sách conversation) nằm trong React Query. */
export const useConversationStore = create<ConversationUIState>((set) => ({
  activeId: null,
  search: "",
  createOpen: false,
  dialog: null,

  setActiveId: (activeId) => set({ activeId }),
  setSearch: (search) => set({ search }),
  openCreate: () => set({ createOpen: true }),
  closeCreate: () => set({ createOpen: false }),
  openDialog: (type, conversation) => set({ dialog: { type, conversation } }),
  closeDialog: () => set({ dialog: null }),
}))

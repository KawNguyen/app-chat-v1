import { Server, Users } from "lucide-react"

export type ConversationSettingDataType = {
  nav: {
    name: string
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  }[]
}

export const conversationSettingData: ConversationSettingDataType = {
  nav: [
    { name: "Server Profile", icon: Server },
    { name: "Members", icon: Users },
  ],
}

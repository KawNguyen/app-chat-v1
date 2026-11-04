import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { conversationKeys } from "@/hooks/conversation/queries/conversation.query"
import { getConversationsOnServer } from "@/service/server/conversation.server"
import { QueryClient } from "@tanstack/react-query"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("at")?.value

  if (!accessToken) {
    redirect("/signin")
  }

  const queryClient = new QueryClient()
  await queryClient.query({
    queryKey: [conversationKeys.all],
    queryFn: async () => getConversationsOnServer(),
  })

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="h-svh min-h-0 overflow-hidden md:peer-data-[variant=inset]:h-[calc(100svh-1rem)]">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

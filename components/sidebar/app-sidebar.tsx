"use client"

import { IconMessageCircle2Filled } from "@tabler/icons-react"
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useMe } from "@/hooks/auth/queries/auth.query"
import { NavUser } from "./nav-user"
import { NavUserSkeleton } from "./skeletons/nav-user.skeleton"
import { CreateGroupDialog } from "./create-group-dialog"
import { NavConversations } from "./nav-conversation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user, isPending, isError } = useMe()

  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
                <IconMessageCircle2Filled className="size-5!" />
                <span className="text-base font-semibold">Acme Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavConversations />
        </SidebarContent>

        <SidebarFooter>
          {isPending ? (
            <NavUserSkeleton />
          ) : isError || !user ? null : (
            <NavUser user={user} />
          )}
        </SidebarFooter>
      </Sidebar>

      <CreateGroupDialog />
    </>
  )
}

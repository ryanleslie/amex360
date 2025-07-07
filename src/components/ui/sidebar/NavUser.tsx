
import * as React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./SidebarMenu"

export function NavUser() {
  const { user, isAdmin } = useAuth()

  if (!user) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-default hover:bg-transparent px-1 py-1.5">
          <div className="grid flex-1 text-left text-sm leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">Logged in as:</span>
              <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
                {isAdmin ? "admin" : "user"}
              </Badge>
            </div>
            <div className="truncate font-normal text-xs">{user.email}</div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}


import * as React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./SidebarMenu"

export function NavUser() {
  const { user } = useAuth()

  if (!user) return null

  const displayRole = user.role === 'user' ? 'Viewer' : user.role === 'admin' ? 'Admin' : user.role
  const isAdmin = user.role === 'admin'
  const displayName = user.display_name || user.user_id

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-default hover:bg-transparent px-1 py-1.5">
          <div className="grid flex-1 text-left text-sm leading-tight">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-xs">Logged in as:</span>
              <span className="truncate font-normal">{displayName}</span>
              {displayRole && (
                <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700 font-light border-0 rounded-md px-1.5 py-0.5">
                  {displayRole}
                </Badge>
              )}
            </div>
            <span className="text-muted-foreground truncate text-xs">
              {user.email}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

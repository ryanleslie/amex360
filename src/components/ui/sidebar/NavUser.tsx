
import * as React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./SidebarMenu"

export function NavUser() {
  const { user, profile } = useAuth()

  if (!user) return null

  const displayRole = profile?.role === 'user' ? 'Viewer' : profile?.role === 'admin' ? 'Admin' : profile?.role
  const isAdmin = profile?.role === 'admin'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-default hover:bg-transparent px-1 py-1.5">
          <div className="grid flex-1 text-left text-sm leading-tight">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-xs">Logged in as:</span>
              <span className="truncate font-normal">{user.id}</span>
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

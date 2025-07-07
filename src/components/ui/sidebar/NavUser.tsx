
import * as React from "react"
import { Shield } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./SidebarMenu"

export function NavUser() {
  const { user, isAdmin } = useAuth()

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const currentRole = isAdmin ? 'admin' : 'user';

  if (!user) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-default hover:bg-transparent px-1 py-1.5">
          <div className="grid flex-1 text-left text-sm leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">Logged in as:</span>
              <Badge variant={getRoleBadgeVariant(currentRole)}>
                <Shield className="h-3 w-3 mr-1" />
                {currentRole === 'user' ? 'guest' : currentRole}
              </Badge>
            </div>
            <div className="truncate font-normal text-xs">{user.email}</div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

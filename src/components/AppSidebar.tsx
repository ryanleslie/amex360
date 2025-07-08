
import React from "react"
import { ChartNoAxesColumn, Award, CreditCard, Crown, LogOut, RotateCw, CircleCheck, Settings, Plane, ChartPie } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "@/components/ui/sonner"
import { useAuth } from "@/contexts/AuthContext"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar"
import { DashboardSection } from "@/pages/Dashboard"

interface AppSidebarProps {
  activeSection: DashboardSection
}

export function AppSidebar({ activeSection }: AppSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { close } = useSidebar()
  const { signOut, isAdmin } = useAuth()

  // Base menu items available to all users
  const baseMenuItems = [
    {
      title: "Dashboard",
      icon: ChartNoAxesColumn,
      path: "/dashboard",
      section: "dashboard" as DashboardSection,
    },
    {
      title: "Insights",
      icon: ChartPie,
      path: "/insights",
      section: "insights" as DashboardSection,
    },
    {
      title: "Bonus Awards",
      icon: Award,
      path: "/rewards",
      section: "rewards" as DashboardSection,
    },
    {
      title: "Employee Cards",
      icon: CreditCard,
      path: "/employee",
      section: "employee" as DashboardSection,
    },
    {
      title: "CreditMax",
      icon: Crown,
      path: "/creditmax",
      section: "creditmax" as DashboardSection,
    },
    {
      title: "Redemptions",
      icon: Plane,
      path: "/redemptions",
      section: "redemptions" as DashboardSection,
    },
  ]

  // Use base menu items for all users
  const menuItems = baseMenuItems

  const handleItemClick = (path: string) => {
    navigate(path)
    close()
  }

  const handleRefreshData = () => {
    try {
      // Import transaction filter service and calculations cache
      const { transactionFilterService } = require("@/services/transactionFilterService")
      const { CalculationsCacheService } = require("@/services/calculationsCache")
      
      console.log("Refreshing transaction data and clearing caches...")
      
      // Refresh transaction data from CSV
      transactionFilterService.refreshData()
      
      // Clear all calculation caches
      CalculationsCacheService.refreshAllCaches()
      
      toast.success("Data refreshed", {
        description: "Latest CSV data loaded and caches cleared",
        position: "top-right",
        icon: <CircleCheck size={16} style={{ color: '#006fcf' }} />
      })
    } catch (error) {
      console.error("Failed to refresh data:", error)
      toast.error("Refresh failed", {
        description: "Could not reload data. Please try again.",
        position: "top-right"
      })
    }
    close()
  }

  const handleAdminClick = () => {
    navigate("/admin")
    close()
  }

  const handleLogout = async () => {
    await signOut()
    close()
    navigate("/")
  }

  return (
    <Sidebar>
      <SidebarContent>
        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>AMEX 360°</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  onClick={() => handleItemClick(item.path)}
                  className={`gap-3 ${location.pathname === item.path ? 'bg-gray-100' : ''}`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Data Management Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Data</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={handleRefreshData}
                className="gap-3"
              >
                <RotateCw className="h-4 w-4" />
                <span>Refresh</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Account Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarMenu>
            {isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleAdminClick}
                  className={`gap-3 ${location.pathname === '/admin' ? 'bg-gray-100' : ''}`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={handleLogout}
                className="gap-3"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

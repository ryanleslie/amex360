
import React from "react"
import { ChartNoAxesColumn, Award, CreditCard, Crown, LogOut, RotateCw, CircleCheck, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"
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
  setActiveSection: (section: DashboardSection) => void
}

const menuItems = [
  {
    title: "Dashboard",
    icon: ChartNoAxesColumn,
    section: "dashboard" as DashboardSection,
  },
  {
    title: "Bonus Awards",
    icon: Award,
    section: "rewards" as DashboardSection,
  },
  {
    title: "Employee Cards",
    icon: CreditCard,
    section: "employee" as DashboardSection,
  },
  {
    title: "CreditMax",
    icon: Crown,
    section: "creditmax" as DashboardSection,
  },
]

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  const navigate = useNavigate()
  const { close } = useSidebar()
  const { signOut, isAdmin } = useAuth()

  const handleItemClick = (section: DashboardSection) => {
    setActiveSection(section)
    close()
  }

  const handleRefreshData = () => {
    // Simulate data refresh
    console.log("Refreshing static data...")
    
    // Show success toast with blue circle-check icon
    toast.success("Dashboard refreshed", {
      description: "Latest transaction data has been loaded",
      position: "top-right",
      icon: <CircleCheck size={16} style={{ color: '#006fcf' }} />
    })
    
    close()
  }

  const handleAdminClick = () => {
    setActiveSection("admin")
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
                  onClick={() => handleItemClick(item.section)}
                  className={`gap-3 ${activeSection === item.section ? 'bg-gray-100' : ''}`}
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
            {isAdmin() && (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleAdminClick}
                  className={`gap-3 ${activeSection === 'admin' ? 'bg-gray-100' : ''}`}
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

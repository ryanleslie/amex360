
import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./SidebarContext"
import { SidebarOverlay } from "./SidebarOverlay"
import { NavUser } from "./NavUser"

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen, close } = useSidebar()

  return (
    <>
      <SidebarOverlay />
      <div
        ref={ref}
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <img 
              src="https://i.imgur.com/K1hwm2e.png" 
              alt="Amex Logo"
              className="min-w-[100px]"
            />
          </div>
          <button
            onClick={close}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        <div className="p-4">
          <NavUser />
        </div>
      </div>
    </>
  )
})
Sidebar.displayName = "Sidebar"

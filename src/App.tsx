
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { SidebarProvider } from "@/components/ui/sidebar"
import Index from "./pages/Index"
import Dashboard from "./pages/Dashboard"
import Rewards from "./pages/Rewards"
import Redemptions from "./pages/Redemptions"
import Employee from "./pages/Employee"
import CreditMax from "./pages/CreditMax"
import AuthPage from "./pages/AuthPage"
import ProtectedRoute from "./components/ProtectedRoute"
import NotFound from "./pages/NotFound"
import { cardBalanceService } from "@/services/cardBalanceService"
import { useEffect } from "react"

const queryClient = new QueryClient()

function App() {
  // Initialize card balances on app load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("Initializing app...")
        await cardBalanceService.initializeBalances()
        console.log("App initialization complete")
      } catch (error) {
        console.error("Failed to initialize app:", error)
      }
    }
    
    initializeApp()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <SidebarProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/rewards" element={
                  <ProtectedRoute>
                    <Rewards />
                  </ProtectedRoute>
                } />
                <Route path="/redemptions" element={
                  <ProtectedRoute>
                    <Redemptions />
                  </ProtectedRoute>
                } />
                <Route path="/employee" element={
                  <ProtectedRoute>
                    <Employee />
                  </ProtectedRoute>
                } />
                <Route path="/creditmax" element={
                  <ProtectedRoute>
                    <CreditMax />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                          location.pathname === '/insights' || 
                          location.pathname === '/rewards' || 
                          location.pathname === '/employee' || 
                          location.pathname === '/creditmax' || 
                          location.pathname === '/admin' || 
                          location.pathname === '/redemptions';

  return (
    <div className={`h-screen w-full ${isDashboardRoute ? 'flex' : ''}`}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/insights" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/rewards" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employee" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/creditmax" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/redemptions" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SidebarProvider>
              <AppContent />
            </SidebarProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

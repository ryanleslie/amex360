
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { CircleCheck } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./Index";
import Employee from "./Employee";
import Rewards from "./Rewards";
import CreditMax from "./CreditMax";
import Redemptions from "./Redemptions";
import { CategorySpendingChart } from "@/components/chart/CategorySpendingChart";
import { QuickMetricsCards } from "@/components/QuickMetricsCards";
import { InsightsQuickMetrics } from "@/components/insights/InsightsQuickMetrics";
import { UserListCard } from "@/components/admin/UserListCard";
import { AdminBalancesCard } from "@/components/admin/AdminBalancesCard";
import { useFilterState } from "@/hooks/useFilterState";

export type DashboardSection = "dashboard" | "insights" | "rewards" | "employee" | "creditmax" | "admin" | "redemptions";

const Dashboard = () => {
  const location = useLocation();
  const { filters, updateFilter } = useFilterState("ytd");
  
  // Check for refresh toast flag after component mounts
  useEffect(() => {
    const showRefreshToast = localStorage.getItem('showRefreshToast');
    if (showRefreshToast === 'true') {
      toast.success("Data refreshed", {
        description: "All data and calculations have been updated",
        position: "top-right",
        icon: <CircleCheck size={16} style={{ color: '#006fcf' }} />
      });
      localStorage.removeItem('showRefreshToast');
    }
  }, []);

  // Determine active section from URL
  const getActiveSectionFromPath = (pathname: string): DashboardSection => {
    if (pathname === "/insights") return "insights";
    if (pathname === "/rewards") return "rewards";
    if (pathname === "/employee") return "employee";
    if (pathname === "/creditmax") return "creditmax";
    if (pathname === "/admin") return "admin";
    if (pathname === "/redemptions") return "redemptions";
    return "dashboard";
  };

  const activeSection = getActiveSectionFromPath(location.pathname);

  const handleTimeRangeChange = (timeRange: string) => {
    console.log("Dashboard: Time range changing to:", timeRange)
    updateFilter("selectedTimeRange", timeRange);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Index />;
      case "insights":
        return (
          <div className="space-y-6 p-6 pt-0">
            <div className="max-w-7xl mx-auto">
              <InsightsQuickMetrics />
            </div>
            <div className="max-w-7xl mx-auto">
              <CategorySpendingChart 
                selectedTimeRange={filters.selectedTimeRange}
                onTimeRangeChange={handleTimeRangeChange}
              />
            </div>
          </div>
        );
      case "rewards":
        return <Rewards />;
      case "employee":
        return <Employee />;
      case "creditmax":
        return <CreditMax />;
      case "redemptions":
        return <Redemptions />;
      case "admin":
        return (
          <div className="p-6 pt-0">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <UserListCard />
                </div>
                <div className="lg:col-span-2">
                  <AdminBalancesCard />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Index />;
    }
  };

  return (
    <>
      <AppSidebar activeSection={activeSection} />
      <div className="flex-1 flex flex-col">
        <AppHeader />
        {renderSection()}
      </div>
    </>
  );
};

export default Dashboard;

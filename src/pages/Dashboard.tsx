
import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./Index";
import Employee from "./Employee";
import Rewards from "./Rewards";
import CreditMax from "./CreditMax";
import Redemptions from "./Redemptions";
import { CategorySpendingChart } from "@/components/chart/CategorySpendingChart";
import { UserCreationForm } from "@/components/admin/UserCreationForm";
import { UserListCard } from "@/components/admin/UserListCard";
import { useFilterState } from "@/hooks/useFilterState";

export type DashboardSection = "dashboard" | "insights" | "rewards" | "employee" | "creditmax" | "admin" | "redemptions";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>("dashboard");
  const { filters, updateFilter } = useFilterState("ytd");

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
          <div className="p-6 pt-2">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <UserCreationForm />
              <UserListCard />
            </div>
          </div>
        );
      default:
        return <Index />;
    }
  };

  return (
    <>
      <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col">
        <AppHeader />
        {renderSection()}
      </div>
    </>
  );
};

export default Dashboard;

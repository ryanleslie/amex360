
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

export type DashboardSection = "dashboard" | "insights" | "rewards" | "employee" | "creditmax" | "admin" | "redemptions";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Index />;
      case "insights":
        return (
          <div className="p-6 pt-2">
            <div className="max-w-7xl mx-auto">
              <CategorySpendingChart />
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
            <div className="flex flex-wrap justify-center max-w-5xl mx-auto gap-6">
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

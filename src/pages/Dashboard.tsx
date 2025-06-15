import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./Index";
import Employee from "./Employee";
import Rewards from "./Rewards";
import CreditMax from "./CreditMax";
import Redemptions from "./Redemptions";

export type DashboardSection = "dashboard" | "rewards" | "employee" | "creditmax" | "admin" | "redemptions";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Index />;
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
          <div className="p-6 space-y-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-muted-foreground">Admin Panel</h2>
              <p className="text-muted-foreground mt-2">Admin functionality will be added here.</p>
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

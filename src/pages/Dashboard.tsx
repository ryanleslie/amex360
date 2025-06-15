
import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./Index";
import Employee from "./Employee";
import Rewards from "./Rewards";
import CreditMax from "./CreditMax";

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
        return (
          <div className="p-6 space-y-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-muted-foreground">Redemptions</h2>
              <p className="text-muted-foreground mt-2">This section is only visible to admin users.</p>
              <p className="text-muted-foreground opacity-60 mt-1">Redemption dashboard coming soon.</p>
            </div>
          </div>
        );
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

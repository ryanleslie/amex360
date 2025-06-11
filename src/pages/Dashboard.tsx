
import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./Index";
import Employee from "./Employee";
import Rewards from "./Rewards";
import CreditMax from "./CreditMax";
import { AccountExtractorComponent } from "@/components/account/AccountExtractorComponent";
import { TransactionImportComponent } from "@/components/transaction/TransactionImporter";

export type DashboardSection = "dashboard" | "rewards" | "employee" | "creditmax" | "admin";

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
      case "admin":
        return (
          <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Admin Tools</h1>
            <div className="grid gap-6">
              <TransactionImportComponent />
              <AccountExtractorComponent />
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

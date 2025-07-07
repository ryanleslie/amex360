
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Users, CreditCard, Link2 } from 'lucide-react';

interface AdminToggleProps {
  activeView: "users" | "balances" | "plaid";
  onViewChange: (view: "users" | "balances" | "plaid") => void;
}

export function AdminToggle({ activeView, onViewChange }: AdminToggleProps) {
  return (
    <div className="flex justify-center animate-fade-in">
      <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
        <Toggle
          pressed={activeView === "users"}
          onPressedChange={() => onViewChange("users")}
          className="flex items-center gap-2 px-4 py-2 data-[state=on]:bg-background data-[state=on]:shadow-sm"
        >
          <Users className="h-4 w-4" />
          Users
        </Toggle>
        <Toggle
          pressed={activeView === "balances"}
          onPressedChange={() => onViewChange("balances")}
          className="flex items-center gap-2 px-4 py-2 data-[state=on]:bg-background data-[state=on]:shadow-sm"
        >
          <CreditCard className="h-4 w-4" />
          Balances
        </Toggle>
        <Toggle
          pressed={activeView === "plaid"}
          onPressedChange={() => onViewChange("plaid")}
          className="flex items-center gap-2 px-4 py-2 data-[state=on]:bg-background data-[state=on]:shadow-sm"
        >
          <Link2 className="h-4 w-4" />
          Plaid
        </Toggle>
      </div>
    </div>
  );
}

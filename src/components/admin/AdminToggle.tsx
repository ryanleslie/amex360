
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Users, CreditCard } from 'lucide-react';

interface AdminToggleProps {
  activeView: "users" | "balances";
  onViewChange: (view: "users" | "balances") => void;
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
      </div>
    </div>
  );
}

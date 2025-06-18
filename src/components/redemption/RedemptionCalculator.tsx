
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function RedemptionCalculator() {
  const [points, setPoints] = useState<string>("");
  const [isEmployee, setIsEmployee] = useState(false);

  const pointsValue = parseFloat(points) || 0;

  // Cash values
  const standardCash = pointsValue * 0.006;
  const businessPlatinumCash = pointsValue * 0.01;
  const schwabPlatinumCash = pointsValue * 0.011;

  // Spend requirements
  const goldSpend = isEmployee ? pointsValue / 7.75 : pointsValue / 4;
  const blueSpend = isEmployee ? pointsValue / 5.75 : pointsValue / 2;
  const platinumSpend = isEmployee ? pointsValue / 5.25 : pointsValue / 1.5;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Points Input */}
      <div className="space-y-2">
        <Label htmlFor="points">Points to Redeem</Label>
        <Input
          id="points"
          type="number"
          placeholder="Enter points amount"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="text-lg"
        />
      </div>

      {/* Employee Toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id="employee"
          checked={isEmployee}
          onCheckedChange={setIsEmployee}
        />
        <Label htmlFor="employee">Employee rates</Label>
      </div>

      {pointsValue > 0 && (
        <>
          {/* Cash Values */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Cash Value</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Standard</span>
                <span className="font-semibold">{formatCurrency(standardCash)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Business Platinum</span>
                <span className="font-semibold">{formatCurrency(businessPlatinumCash)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Schwab Platinum</span>
                <span className="font-semibold">{formatCurrency(schwabPlatinumCash)}</span>
              </div>
            </div>
          </div>

          {/* Spend Requirements */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">
              Spend Required to Earn Points {isEmployee && "(Employee)"}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Gold Card</span>
                <span className="font-semibold">{formatCurrency(goldSpend)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Blue Card</span>
                <span className="font-semibold">{formatCurrency(blueSpend)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Platinum Card</span>
                <span className="font-semibold">{formatCurrency(platinumSpend)}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

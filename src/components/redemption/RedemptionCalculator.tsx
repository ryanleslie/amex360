
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function RedemptionCalculator() {
  const [points, setPoints] = useState<string>("");
  const [showEmployeeRates, setShowEmployeeRates] = useState(false);

  const pointsValue = parseFloat(points) || 0;

  // Cash value calculations
  const standardCashValue = pointsValue * 0.006;
  const businessPlatinumCashValue = pointsValue * 0.01;
  const schwabPlatinumCashValue = pointsValue * 0.011;

  // Spend requirement calculations
  const goldSpendRequirement = pointsValue / 4;
  const goldEmployeeSpendRequirement = pointsValue / 7.75;
  const blueSpendRequirement = pointsValue / 2;
  const blueEmployeeSpendRequirement = pointsValue / 5.75;
  const platinumSpendRequirement = pointsValue / 1.5;
  const platinumEmployeeSpendRequirement = pointsValue / 5.25;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Points Input */}
      <div className="space-y-2">
        <Label htmlFor="points-input" className="text-sm font-medium">
          Points to redeem
        </Label>
        <Input
          id="points-input"
          type="number"
          placeholder="Enter points amount"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="text-lg"
        />
      </div>

      {/* Employee Rates Toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id="employee-rates"
          checked={showEmployeeRates}
          onCheckedChange={setShowEmployeeRates}
        />
        <Label htmlFor="employee-rates" className="text-sm">
          Show employee rates
        </Label>
      </div>

      {pointsValue > 0 && (
        <>
          {/* Cash Value Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Cash Value</h3>
            <div className="grid gap-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Standard</span>
                <span className="text-lg font-bold">{formatCurrency(standardCashValue)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Business Platinum</span>
                <span className="text-lg font-bold">{formatCurrency(businessPlatinumCashValue)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Schwab Platinum</span>
                <span className="text-lg font-bold">{formatCurrency(schwabPlatinumCashValue)}</span>
              </div>
            </div>
          </div>

          {/* Spend Requirements Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Spend Requirements</h3>
            <div className="grid gap-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Gold Card</span>
                  <span className="text-lg font-bold">{formatCurrency(goldSpendRequirement)}</span>
                </div>
                {showEmployeeRates && (
                  <div className="flex justify-between items-center p-3 bg-blue-100 rounded-lg ml-4">
                    <span className="text-sm font-medium">Gold Employee</span>
                    <span className="text-lg font-bold">{formatCurrency(goldEmployeeSpendRequirement)}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Blue Card</span>
                  <span className="text-lg font-bold">{formatCurrency(blueSpendRequirement)}</span>
                </div>
                {showEmployeeRates && (
                  <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg ml-4">
                    <span className="text-sm font-medium">Blue Employee</span>
                    <span className="text-lg font-bold">{formatCurrency(blueEmployeeSpendRequirement)}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">Platinum Card</span>
                  <span className="text-lg font-bold">{formatCurrency(platinumSpendRequirement)}</span>
                </div>
                {showEmployeeRates && (
                  <div className="flex justify-between items-center p-3 bg-purple-100 rounded-lg ml-4">
                    <span className="text-sm font-medium">Platinum Employee</span>
                    <span className="text-lg font-bold">{formatCurrency(platinumEmployeeSpendRequirement)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

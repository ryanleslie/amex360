
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function RedemptionCalculator() {
  const [points, setPoints] = useState<string>("");
  const [isEmployee, setIsEmployee] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // If the input ends with ' pts', remove it before processing
    const cleanValue = inputValue.replace(/ pts$/, '').replace(/[^\d.]/g, '');
    setPoints(cleanValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;
    const inputValue = input.value;
    
    // If backspace is pressed and cursor is after ' pts', move cursor before ' pts'
    if (e.key === 'Backspace' && inputValue.endsWith(' pts') && cursorPosition >= inputValue.length - 4) {
      e.preventDefault();
      const newValue = inputValue.replace(/ pts$/, '');
      const cleanValue = newValue.replace(/[^\d.]/g, '');
      setPoints(cleanValue);
      
      // Set cursor position after state update
      setTimeout(() => {
        if (inputRef.current) {
          const newDisplayValue = cleanValue ? `${parseFloat(cleanValue).toLocaleString('en-US')} pts` : cleanValue;
          const newCursorPos = Math.max(0, newDisplayValue.length - 4);
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  };

  const getDisplayValue = () => {
    if (!points || pointsValue === 0) return "";
    return `${pointsValue.toLocaleString('en-US')} pts`;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Points Input */}
      <div className="space-y-2">
        <Label htmlFor="points">Points to Redeem</Label>
        <div className="relative">
          <Input
            ref={inputRef}
            id="points"
            type="text"
            placeholder="Enter points amount"
            value={pointsValue > 0 ? getDisplayValue() : points}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="text-2xl lg:text-3xl font-semibold tabular-nums h-16 px-4 text-center bg-white"
            style={{ color: '#00175a' }}
          />
        </div>
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

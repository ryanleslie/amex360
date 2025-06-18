
import React, { useState, useRef, useEffect } from "react";
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

  const formatDisplayValue = (value: string) => {
    if (!value || parseFloat(value) === 0) return "";
    const numValue = parseFloat(value);
    return `${numValue.toLocaleString('en-US')} pts`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const value = input.value;
    
    // Remove non-numeric characters except for decimal points
    // Also remove " pts" suffix if present
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Update the points state
    setPoints(cleanValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const value = input.value;
    const cursorPosition = input.selectionStart || 0;
    
    // Handle backspace and delete when cursor is after the numeric part
    if ((e.key === 'Backspace' || e.key === 'Delete') && value.includes(" pts")) {
      const ptsIndex = value.indexOf(" pts");
      // Only prevent deletion if cursor is actually in the " pts" suffix (not at the boundary)
      if (cursorPosition > ptsIndex) {
        e.preventDefault();
        // Move cursor to end of numeric part
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(ptsIndex, ptsIndex);
          }
        }, 0);
      }
    }
    
    // Prevent typing in the " pts" suffix area
    if (value.includes(" pts") && cursorPosition > value.indexOf(" pts")) {
      if (e.key.length === 1 || e.key === 'Enter') {
        e.preventDefault();
        setTimeout(() => {
          if (inputRef.current) {
            const numericPart = value.replace(" pts", "");
            inputRef.current.setSelectionRange(numericPart.length, numericPart.length);
          }
        }, 0);
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const value = input.value;
    const cursorPosition = input.selectionStart || 0;
    
    // If click is in the " pts" suffix area, move cursor before the suffix
    if (value.includes(" pts") && cursorPosition > value.indexOf(" pts")) {
      e.preventDefault();
      const numericPart = value.replace(" pts", "");
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(numericPart.length, numericPart.length);
        }
      }, 0);
    }
  };

  // Update the display value when points change
  useEffect(() => {
    if (inputRef.current && pointsValue > 0) {
      const formattedValue = formatDisplayValue(points);
      if (inputRef.current.value !== formattedValue) {
        inputRef.current.value = formattedValue;
        // Always set cursor position at the end of the numeric part (before " pts")
        const numericPart = formattedValue.replace(" pts", "");
        inputRef.current.setSelectionRange(numericPart.length, numericPart.length);
      }
    } else if (inputRef.current && pointsValue === 0) {
      inputRef.current.value = points;
      // Set cursor at the end of the input when no formatting is applied
      inputRef.current.setSelectionRange(points.length, points.length);
    }
  }, [points, pointsValue]);

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
            defaultValue=""
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spend Requirements - On the left */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">
              Spend required to earn/replenish points
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Business Gold</span>
                <span className="font-semibold">{formatCurrency(goldSpend)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Business Blue Plus</span>
                <span className="font-semibold">{formatCurrency(blueSpend)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Business Platinum</span>
                <span className="font-semibold">{formatCurrency(platinumSpend)}</span>
              </div>
            </div>
          </div>

          {/* Cash Values - On the right */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Cash redemption value</h3>
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
        </div>
      )}
    </div>
  );
}

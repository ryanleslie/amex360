
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Crown } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { getCardImage } from "@/utils/cardImageUtils";

export function RedemptionCalculator() {
  const [points, setPoints] = useState<string>("40000");
  const [isEmployee, setIsEmployee] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved values on component mount
  useEffect(() => {
    const savedPoints = localStorage.getItem('redemption-calculator-points');
    const savedIsEmployee = localStorage.getItem('redemption-calculator-employee');
    
    if (savedPoints) {
      setPoints(savedPoints);
    }
    if (savedIsEmployee) {
      setIsEmployee(savedIsEmployee === 'true');
    }
  }, []);

  // Save points value to localStorage whenever it changes
  useEffect(() => {
    if (points) {
      localStorage.setItem('redemption-calculator-points', points);
    } else {
      localStorage.removeItem('redemption-calculator-points');
    }
  }, [points]);

  // Save employee toggle to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('redemption-calculator-employee', isEmployee.toString());
  }, [isEmployee]);

  const pointsValue = parseFloat(points) || 0;

  // Cash values
  const standardCash = pointsValue * 0.006;
  const businessPlatinumCash = pointsValue * 0.01;
  const schwabPlatinumCash = pointsValue * 0.011;

  // Spend requirements
  const goldSpend = isEmployee ? pointsValue / 7.75 : pointsValue / 4;
  const blueSpend = isEmployee ? pointsValue / 5.75 : pointsValue / 2;
  const platinumSpend = isEmployee ? pointsValue / 5.25 : pointsValue / 1.5;

  // CreditMax calculations (3% of normal spend)
  const goldCreditMaxSpend = goldSpend * 0.03;
  const blueCreditMaxSpend = blueSpend * 0.03;
  const platinumCreditMaxSpend = platinumSpend * 0.03;

  // Animated values
  const animatedStandardCash = useCountUp({ end: standardCash, duration: 600 });
  const animatedBusinessPlatinumCash = useCountUp({ end: businessPlatinumCash, duration: 600 });
  const animatedSchwabPlatinumCash = useCountUp({ end: schwabPlatinumCash, duration: 600 });
  const animatedGoldSpend = useCountUp({ end: goldSpend, duration: 600 });
  const animatedBlueSpend = useCountUp({ end: blueSpend, duration: 600 });
  const animatedPlatinumSpend = useCountUp({ end: platinumSpend, duration: 600 });
  const animatedGoldCreditMaxSpend = useCountUp({ end: goldCreditMaxSpend, duration: 600 });
  const animatedBlueCreditMaxSpend = useCountUp({ end: blueCreditMaxSpend, duration: 600 });
  const animatedPlatinumCreditMaxSpend = useCountUp({ end: platinumCreditMaxSpend, duration: 600 });

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
        <Label htmlFor="points">Points to earn/redeem:</Label>
        <div className="relative">
          <Input
            ref={inputRef}
            id="points"
            type="text"
            placeholder="Enter points amount"
            defaultValue="40000"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            className="text-2xl lg:text-3xl font-semibold tabular-nums h-16 px-4 text-center bg-white"
            style={{ color: '#00175a' }}
          />
        </div>
      </div>

      {pointsValue > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cash Values - Left column */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Cash redemption value</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img 
                    src={getCardImage("standard")} 
                    alt="Standard Redemption" 
                    className="w-10 h-6 object-cover rounded"
                  />
                  <span className="text-sm font-medium">Statement credit <span className="text-muted-foreground">(10,000 points = $60.00)</span></span>
                </div>
                <span className="font-semibold transition-all duration-300">{formatCurrency(animatedStandardCash)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img 
                    src={getCardImage("business platinum")} 
                    alt="Business Platinum Card" 
                    className="w-10 h-6 object-cover rounded"
                  />
                  <span className="text-sm font-medium">Business Platinum <span className="text-muted-foreground">(10,000 points = $100.00)</span></span>
                </div>
                <span className="font-semibold transition-all duration-300">{formatCurrency(animatedBusinessPlatinumCash)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img 
                    src={getCardImage("schwab platinum")} 
                    alt="Schwab Platinum Card" 
                    className="w-10 h-6 object-cover rounded"
                  />
                  <span className="text-sm font-medium">Schwab Platinum <span className="text-muted-foreground">(10,000 points = $110.00)</span></span>
                </div>
                <span className="font-semibold transition-all duration-300">{formatCurrency(animatedSchwabPlatinumCash)}</span>
              </div>
            </div>
          </div>

          {/* Spend Requirements - Right column */}
          <div className="space-y-3">
            {/* Header with employee toggle */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                Card spend required
              </h3>
              <div className="flex items-center space-x-2">
                <Label htmlFor="employee">Employee card rates</Label>
                <Switch
                  id="employee"
                  checked={isEmployee}
                  onCheckedChange={setIsEmployee}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img 
                    src={getCardImage(isEmployee ? "business gold employee" : "business gold")} 
                    alt="Business Gold Card" 
                    className="w-10 h-6 object-cover rounded"
                  />
                  <span className="text-sm font-medium">
                    Business Gold <span className="text-muted-foreground">({isEmployee ? "7.75x" : "4x"})</span>
                  </span>
                </div>
                <div className="transition-all duration-300 flex items-center gap-1">
                  <span className="font-semibold">{formatCurrency(animatedGoldSpend)}</span>
                  <span>/</span>
                  <span className="font-normal text-xs">{formatCurrency(animatedGoldCreditMaxSpend)}</span>
                  <Crown className="h-4 w-4" style={{ color: '#006fcf' }} />
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img 
                    src={getCardImage(isEmployee ? "business blue employee" : "business blue")} 
                    alt="Business Blue Card" 
                    className="w-10 h-6 object-cover rounded"
                  />
                  <span className="text-sm font-medium">
                    Business Blue Plus <span className="text-muted-foreground">({isEmployee ? "5.75x" : "2x"})</span>
                  </span>
                </div>
                <div className="transition-all duration-300 flex items-center gap-1">
                  <span className="font-semibold">{formatCurrency(animatedBlueSpend)}</span>
                  <span>/</span>
                  <span className="font-normal text-xs">{formatCurrency(animatedBlueCreditMaxSpend)}</span>
                  <Crown className="h-4 w-4" style={{ color: '#006fcf' }} />
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img 
                    src={getCardImage(isEmployee ? "business platinum employee" : "business platinum")} 
                    alt="Business Platinum Card" 
                    className="w-10 h-6 object-cover rounded"
                  />
                  <span className="text-sm font-medium">
                    Business Platinum <span className="text-muted-foreground">({isEmployee ? "5.25x" : "1.5x"})</span>
                  </span>
                </div>
                <div className="transition-all duration-300 flex items-center gap-1">
                  <span className="font-semibold">{formatCurrency(animatedPlatinumSpend)}</span>
                  <span>/</span>
                  <span className="font-normal text-xs">{formatCurrency(animatedPlatinumCreditMaxSpend)}</span>
                  <Crown className="h-4 w-4" style={{ color: '#006fcf' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

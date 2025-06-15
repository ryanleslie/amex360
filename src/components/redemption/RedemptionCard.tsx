
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RedemptionTable } from "./RedemptionTable";
import { FilterState } from "@/hooks/useFilterState";
import { parseRedemptions } from "@/utils/redemptionParser";

interface RedemptionCardProps {
  filters: FilterState;
}

export function RedemptionCard({ filters }: RedemptionCardProps) {
  const redemptions = parseRedemptions();
  
  // Convert to the format expected by RedemptionTable
  const formattedRedemptions = redemptions.map(redemption => ({
    id: redemption.id,
    date: redemption.date,
    redemptionAmount: redemption.points,
    partner: redemption.description,
    category: redemption.category === 'Airfare' ? 'flight' as const : 'hotel' as const,
    value: `$${Math.round(redemption.points * 0.012)}` // Rough conversion at 1.2¢ per point
  }));

  return (
    <Card className="bg-gradient-to-b from-white to-gray-100">
      <CardHeader>
        <CardTitle className="text-xl font-semibold" style={{ color: '#00175a' }}>
          Recent Redemptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RedemptionTable redemptions={formattedRedemptions} />
      </CardContent>
    </Card>
  );
}

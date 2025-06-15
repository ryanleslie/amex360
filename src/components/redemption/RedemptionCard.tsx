
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RedemptionTable } from "./RedemptionTable";
import { FilterState } from "@/hooks/useFilterState";
import { parseRedemptionsCSV, formatRedemptionsForTable } from "@/utils/redemptionParser";

interface RedemptionCardProps {
  filters: FilterState;
}

export function RedemptionCard({ filters }: RedemptionCardProps) {
  const redemptions = parseRedemptionsCSV();
  const formattedRedemptions = formatRedemptionsForTable(redemptions);

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

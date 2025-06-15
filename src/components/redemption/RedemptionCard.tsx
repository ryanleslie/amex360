
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RedemptionTable } from "./RedemptionTable";
import { FilterState } from "@/hooks/useFilterState";

interface RedemptionCardProps {
  filters: FilterState;
}

// Dummy redemption data
const dummyRedemptions = [
  {
    id: "1",
    date: "2024-06-10",
    redemptionAmount: 75000,
    partner: "Delta Airlines",
    category: "flight",
    value: "$950"
  },
  {
    id: "2",
    date: "2024-06-08",
    redemptionAmount: 45000,
    partner: "Marriott Hotels",
    category: "hotel",
    value: "$360"
  },
  {
    id: "3",
    date: "2024-06-05",
    redemptionAmount: 25000,
    partner: "United Airlines",
    category: "flight",
    value: "$320"
  },
  {
    id: "4",
    date: "2024-06-03",
    redemptionAmount: 60000,
    partner: "Hilton Hotels",
    category: "hotel",
    value: "$480"
  },
  {
    id: "5",
    date: "2024-06-01",
    redemptionAmount: 85000,
    partner: "American Airlines",
    category: "flight",
    value: "$1,100"
  },
  {
    id: "6",
    date: "2024-05-28",
    redemptionAmount: 35000,
    partner: "Hyatt Hotels",
    category: "hotel",
    value: "$280"
  },
  {
    id: "7",
    date: "2024-05-25",
    redemptionAmount: 55000,
    partner: "Southwest Airlines",
    category: "flight",
    value: "$650"
  },
  {
    id: "8",
    date: "2024-05-22",
    redemptionAmount: 40000,
    partner: "IHG Hotels",
    category: "hotel",
    value: "$320"
  }
];

export function RedemptionCard({ filters }: RedemptionCardProps) {
  return (
    <Card className="bg-gradient-to-b from-white to-gray-100">
      <CardHeader>
        <CardTitle className="text-xl font-semibold" style={{ color: '#00175a' }}>
          Recent Redemptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RedemptionTable redemptions={dummyRedemptions} />
      </CardContent>
    </Card>
  );
}

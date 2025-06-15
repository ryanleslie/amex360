
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RedemptionTableContent } from "./RedemptionTableContent";

const DUMMY_DATA = [
  { date: "2025-03-12", amount: 90000, partner: "Delta", category: "Flight", value: 1200, destination: "Frankfurt" },
  { date: "2025-04-23", amount: 110000, partner: "Marriott", category: "Hotel", value: 950, destination: "Barcelona" },
  { date: "2025-05-03", amount: 112500, partner: "Delta", category: "Flight", value: 1550, destination: "Phoenix" },
  { date: "2025-03-29", amount: 135000, partner: "ANA", category: "Flight", value: 2300, destination: "Edmonton" },
  { date: "2025-02-10", amount: 85000, partner: "Hyatt", category: "Hotel", value: 825, destination: "New York" },
  { date: "2025-01-20", amount: 97500, partner: "United", category: "Flight", value: 1625, destination: "Los Angeles" },
];

export function RedemptionTable() {
  return (
    <Card className="bg-gradient-to-b from-white to-gray-100">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Redemptions</CardTitle>
        <CardDescription>
          Points spent on top travel and hotel partners in 2025.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RedemptionTableContent data={DUMMY_DATA} />
      </CardContent>
    </Card>
  );
}

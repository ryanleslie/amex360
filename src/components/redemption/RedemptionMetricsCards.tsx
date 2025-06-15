
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Airplane } from "lucide-react";

interface RedemptionMetricsCardsProps {
  isVisible: boolean;
  numbersKey: number;
}

export function RedemptionMetricsCards({ isVisible, numbersKey }: RedemptionMetricsCardsProps) {
  const data = [
    {
      title: "Total Redemptions",
      value: 13,
      badge: "",
      icon: () => <Airplane size={18} />,
      footer: "Trips booked",
      description: "Completed in 2025",
    },
    {
      title: "Points Redeemed",
      value: 980_000,
      badge: "",
      icon: () => <img src="https://i.imgur.com/dTz9vVm.png" alt="" className="h-4 w-4" />,
      footer: "Amex Points",
      description: "Total points spent",
    },
    {
      title: "Top Partner",
      value: "Delta",
      badge: "",
      icon: () => <Airplane size={18} />,
      footer: "Airline",
      description: "Most used partner",
    },
    {
      title: "Avg Redemption Value",
      value: "$1,856",
      badge: "",
      icon: () => <Airplane size={18} />,
      footer: "Per trip",
      description: "Average value per redemption",
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {data.map((card, i) => (
        <Card
          className={`bg-gradient-to-b from-white to-gray-100 px-2 py-2 shadow-none
             transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
          key={card.title}
          style={{ transitionDelay: `${i * 50}ms` }}
        >
          <CardContent className="flex flex-col gap-3 py-6">
            <div className="flex items-center gap-2 text-base font-semibold">
              {card.icon()} {card.title}
            </div>
            <div className="text-2xl font-bold tabular-nums">{typeof card.value === "number" ? card.value.toLocaleString() : card.value}</div>
            <div className="text-xs text-muted-foreground">{card.description}</div>
            <div className="mt-1 text-xs text-muted-foreground">{card.footer}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const DESTINATIONS = [
  {
    name: "Frankfurt",
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=150&q=80",
    value: "$2,300",
    times: 2,
  },
  {
    name: "New York",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=150&q=80",
    value: "$1,200",
    times: 3,
  },
  {
    name: "Los Angeles",
    image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=150&q=80",
    value: "$1,625",
    times: 2,
  },
  {
    name: "Phoenix",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&q=80",
    value: "$1,550",
    times: 1,
  },
  {
    name: "Barcelona",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=150&q=80",
    value: "$950",
    times: 1,
  },
  {
    name: "Edmonton",
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=150&q=80",
    value: "$2,300",
    times: 1,
  },
];

export function RedemptionDestinationList() {
  return (
    <Card className="bg-gradient-to-b from-white to-gray-100 flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Top Destinations</CardTitle>
        <CardDescription>
          Most frequent redemption cities
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-2 pb-6">
          {DESTINATIONS.map((dest, i) => (
            <Card key={dest.name} className="flex items-center p-3 gap-4 bg-gradient-to-b from-white to-gray-50 hover:shadow-md">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-14 h-9 rounded object-cover"
                style={{ background: "#eee" }}
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{dest.name}</div>
                <div className="text-xs text-muted-foreground">{dest.times} redemption{dest.times > 1 ? "s" : ""} · {dest.value}</div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

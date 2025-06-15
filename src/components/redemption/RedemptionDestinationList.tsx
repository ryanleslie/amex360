
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const destinations = [
  {
    id: "1",
    name: "Frankfurt",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d36b3c?w=100&h=80&fit=crop",
    pointsRedeemed: 125000,
    trips: 3,
    category: "Europe"
  },
  {
    id: "2",
    name: "New York",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=100&h=80&fit=crop",
    pointsRedeemed: 95000,
    trips: 2,
    category: "Domestic"
  },
  {
    id: "3",
    name: "Los Angeles",
    image: "https://images.unsplash.com/photo-1534190239940-9ba8944ea261?w=100&h=80&fit=crop",
    pointsRedeemed: 85000,
    trips: 2,
    category: "Domestic"
  },
  {
    id: "4",
    name: "Phoenix",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=80&fit=crop",
    pointsRedeemed: 65000,
    trips: 1,
    category: "Domestic"
  },
  {
    id: "5",
    name: "Barcelona",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=100&h=80&fit=crop",
    pointsRedeemed: 110000,
    trips: 2,
    category: "Europe"
  }
];

export function RedemptionDestinationList() {
  const getCategoryColor = (category: string) => {
    return category === "Europe" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800";
  };

  return (
    <Card className="bg-gradient-to-b from-white to-gray-100">
      <CardHeader>
        <CardTitle className="text-xl font-semibold" style={{ color: '#00175a' }}>
          Top Destinations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="flex items-center gap-4 p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
            >
              <img
                src={destination.image}
                alt={destination.name}
                className="w-16 h-12 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm" style={{ color: '#00175a' }}>
                    {destination.name}
                  </h3>
                  <Badge className={getCategoryColor(destination.category)}>
                    {destination.category}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  {destination.pointsRedeemed.toLocaleString()} points redeemed
                </p>
                <p className="text-xs text-gray-500">
                  {destination.trips} trip{destination.trips !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

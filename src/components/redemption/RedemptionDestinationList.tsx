
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <Card className="bg-gradient-to-b from-white to-gray-100 flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold" style={{ color: '#00175a' }}>
          Top Destinations
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="space-y-2 pb-6">
          {destinations.map((destination, index) => (
            <div key={destination.id} className="p-1">
              <Card
                className="bg-gradient-to-b from-white to-gray-50 cursor-pointer transition-all hover:shadow-md animate-fade-in ring-0 focus:ring-0 focus-visible:ring-0"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
                tabIndex={0}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-16 h-10 object-cover rounded"
                      />
                      <div className="text-sm font-medium leading-tight whitespace-pre-line">
                        <div className="mb-1">
                          <span className="font-bold">{destination.name}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {destination.trips} trip{destination.trips !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end sm:justify-end">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Redemption
                        </p>
                        <div className="text-lg font-bold tabular-nums" style={{ color: '#00175a' }}>
                          {destination.pointsRedeemed.toLocaleString()} pts
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

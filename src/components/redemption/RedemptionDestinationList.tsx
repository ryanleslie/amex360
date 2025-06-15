
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseRedemptionsCSV, getTopDestinations } from "@/utils/redemptionParser";

// Static destination images mapping - using same series as carousel
const destinationImages: Record<string, string> = {
  "Frankfurt": "https://www.aman.com/sites/default/files/2022-12/Aman%20New%20York%2C%20USA%2011.jpg",
  "New York": "https://www.aman.com/sites/default/files/styles/carousel_cards_extra_large/public/2022-11/Aman%20New%20York%2C%20USA%20-%20Spa%20%26%20Wellness%2C%20Pool%202.jpg?itok=DBMc8qlk",
  "Los Angeles": "https://www.aman.com/sites/default/files/2023-08/aman-ny-vignettes-6754.jpg",
  "Phoenix": "https://www.aman.com/sites/default/files/styles/media_text_side_by_side_portrait_xwide_up/public/2023-08/aman_new_york_usa_-_three-bedroom_home_bathroom.jpg?itok=C3oFbV3i",
  "Stuttgart": "https://www.aman.com/sites/default/files/2022-12/Aman%20New%20York%2C%20USA%2011.jpg"
};

export function RedemptionDestinationList() {
  const redemptions = parseRedemptionsCSV();
  const topDestinations = getTopDestinations(redemptions, 5);

  return (
    <Card className="bg-gradient-to-b from-white to-gray-100 flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold" style={{ color: '#00175a' }}>
          Top Destinations
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="space-y-2 pb-6">
          {topDestinations.map((destination, index) => (
            <div key={destination.name} className="p-1">
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
                        src={destinationImages[destination.name] || "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=100&h=100&fit=crop"}
                        alt={destination.name}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                      <div className="text-sm font-medium leading-tight whitespace-pre-line">
                        <div className="mb-1">
                          <span className="font-medium">{destination.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {destination.trips} redemption{destination.trips !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end sm:justify-end">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Total points
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

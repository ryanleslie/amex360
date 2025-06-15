
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseRedemptionsCSV, getTopPartners } from "@/utils/redemptionParser";

// Static partner images mapping - updated with new images
const partnerImages: Record<string, string> = {
  "Delta Airlines": "https://i.imgur.com/9COmOAx.jpeg",
  "MARRIOTT": "https://i.imgur.com/ccSztNC.png",
  "AIR FRANCE": "https://i.imgur.com/cVxZ2Z6.jpeg"
};

export function RedemptionPartnerList() {
  const redemptions = parseRedemptionsCSV();
  const topPartners = getTopPartners(redemptions, 5);

  return (
    <Card className="bg-gradient-to-b from-white to-gray-100 flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold" style={{ color: '#00175a' }}>
          Top Partners
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="space-y-2 pb-6">
          {topPartners.map((partner, index) => (
            <div key={partner.name} className="p-1">
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
                        src={partnerImages[partner.name] || "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=100&h=100&fit=crop"}
                        alt={partner.name}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                      <div className="text-sm font-medium leading-tight whitespace-pre-line">
                        <div className="mb-1">
                          <span className="font-medium">{partner.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {partner.redemptions} redemption{partner.redemptions !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end sm:justify-end">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Total points
                        </p>
                        <div className="text-lg font-bold tabular-nums" style={{ color: '#00175a' }}>
                          {partner.pointsRedeemed.toLocaleString()} pts
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

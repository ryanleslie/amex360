
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseRedemptionsCSV, getTopPartners } from "@/utils/redemptionParser";

// Static partner images mapping - updated with new images
const partnerImages: Record<string, string> = {
  "DELTA AIRLINES": "https://i.imgur.com/9COmOAx.jpeg",
  "MARRIOTT": "https://i.imgur.com/ccSztNC.png",
  "AIR FRANCE": "https://i.imgur.com/cVxZ2Z6.jpeg"
};

// Helper function to format partner names with proper capitalization
const formatPartnerName = (name: string): string => {
  return name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

interface RedemptionPartnerListProps {
  selectedPartner?: string;
  onPartnerClick?: (partner: string) => void;
}

export function RedemptionPartnerList({ 
  selectedPartner = "all", 
  onPartnerClick 
}: RedemptionPartnerListProps) {
  const redemptions = parseRedemptionsCSV();
  const topPartners = getTopPartners(redemptions, 5);

  const handlePartnerClick = (partnerName: string) => {
    if (!onPartnerClick) return;
    
    // If the same partner is clicked, deselect it
    if (selectedPartner === partnerName) {
      onPartnerClick("all");
    } else {
      onPartnerClick(partnerName);
    }
  };

  // Filter partners based on selection - show all if "all" is selected, otherwise show only the selected partner
  const displayedPartners = selectedPartner === "all" 
    ? topPartners 
    : topPartners.filter(partner => partner.name === selectedPartner);

  return (
    <Card className="bg-gradient-to-b from-white to-gray-100 flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Top partners
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Redemptions by partner
        </p>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="space-y-2 pb-6">
          {displayedPartners.map((partner, index) => {
            const isSelected = selectedPartner === partner.name;
            
            return (
              <div key={partner.name} className="p-1">
                <Card
                  className="bg-gradient-to-b from-white to-gray-50 cursor-pointer transition-all hover:shadow-md animate-fade-in ring-0 focus:ring-0 focus-visible:ring-0"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                  tabIndex={0}
                  onClick={() => handlePartnerClick(partner.name)}
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
                            <span className="font-medium">{formatPartnerName(partner.name)}</span>
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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

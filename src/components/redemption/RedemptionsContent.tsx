
import React, { useState } from "react";
import { RedemptionsHeader } from "./RedemptionsHeader";
import { RedemptionMetricsCards } from "./RedemptionMetricsCards";
import { RedemptionCarouselCard } from "./RedemptionCarouselCard";
import { RedemptionCard } from "./RedemptionCard";
import { RedemptionPartnerList } from "./RedemptionPartnerList";
import { FilterState } from "@/hooks/useFilterState";

interface RedemptionsContentProps {
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: any) => void;
  updateMultipleFilters: (updates: Partial<FilterState>) => void;
  isVisible: boolean;
  numbersKey: number;
  showContent: boolean;
}

export function RedemptionsContent({
  filters,
  updateFilter,
  updateMultipleFilters,
  isVisible,
  numbersKey,
  showContent
}: RedemptionsContentProps) {
  const [selectedPartner, setSelectedPartner] = useState<string>("all");

  const handlePartnerChange = (partner: string) => {
    setSelectedPartner(partner);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 mb-8">
      <RedemptionsHeader />
      
      <div className={`space-y-6 ${showContent ? 'animate-fade-in' : 'opacity-0'}`}>
        {/* Metrics Cards */}
        <RedemptionMetricsCards 
          filters={filters}
          isVisible={isVisible}
          numbersKey={numbersKey}
        />

        {/* Destinations Carousel - Full Width */}
        <RedemptionCarouselCard />

        {/* Table and Partner List Row - 2/3, 1/3 split */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Redemption Table - 2/3 width */}
          <div className="lg:col-span-2">
            <RedemptionCard 
              filters={filters}
              selectedPartner={selectedPartner}
              onPartnerChange={handlePartnerChange}
            />
          </div>
          
          {/* Top Partners List - 1/3 width */}
          <div className="lg:col-span-1">
            <RedemptionPartnerList 
              selectedPartner={selectedPartner}
              onPartnerClick={handlePartnerChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

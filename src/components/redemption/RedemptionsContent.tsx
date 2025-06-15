
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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handlePartnerChange = (partner: string) => {
    setSelectedPartner(partner);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
      <RedemptionsHeader />
      
      <div className={`space-y-4 sm:space-y-6 ${showContent ? 'animate-fade-in' : 'opacity-0'}`}>
        {/* Metrics Cards */}
        <RedemptionMetricsCards 
          filters={filters}
          isVisible={isVisible}
          numbersKey={numbersKey}
          onCategoryFilter={handleCategoryFilter}
          selectedCategory={selectedCategory}
        />

        {/* Destinations Carousel - Full Width */}
        <RedemptionCarouselCard />

        {/* Table and Partner List Row - Responsive Layout */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Redemption Table - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <RedemptionCard 
              filters={filters}
              selectedPartner={selectedPartner}
              onPartnerChange={handlePartnerChange}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryFilter}
            />
          </div>
          
          {/* Top Partners List - Full width on mobile, 1/3 on desktop */}
          <div className="lg:col-span-1 order-1 lg:order-2">
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

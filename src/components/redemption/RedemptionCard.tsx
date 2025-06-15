
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RedemptionTable } from "./RedemptionTable";
import { PartnerFilterDropdown } from "./PartnerFilterDropdown";
import { RedemptionFilterIndicator } from "./RedemptionFilterIndicator";
import { FilterState } from "@/hooks/useFilterState";
import { parseRedemptionsCSV, formatRedemptionsForTable } from "@/utils/redemptionParser";

interface RedemptionCardProps {
  filters: FilterState;
  selectedPartner?: string;
  onPartnerChange?: (partner: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function RedemptionCard({ 
  filters, 
  selectedPartner = "all",
  onPartnerChange,
  selectedCategory = "all",
  onCategoryChange
}: RedemptionCardProps) {
  const [searchFilter, setSearchFilter] = useState("");
  const [internalSelectedPartner, setInternalSelectedPartner] = useState(selectedPartner);

  const redemptions = parseRedemptionsCSV();
  const formattedRedemptions = formatRedemptionsForTable(redemptions);

  // Get unique partners for dropdown
  const uniquePartners = useMemo(() => {
    const partners = ["AIR FRANCE", "DELTA AIRLINES", "MARRIOTT"];
    return partners;
  }, []);

  // Filter redemptions based on partner, category, and search
  const filteredRedemptions = useMemo(() => {
    let filtered = formattedRedemptions;

    // Filter by selected partner
    const currentPartner = onPartnerChange ? selectedPartner : internalSelectedPartner;
    if (currentPartner && currentPartner !== "all") {
      filtered = filtered.filter(redemption => 
        redemption.partner.toUpperCase() === currentPartner.toUpperCase()
      );
    }

    // Filter by selected category
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(redemption => 
        redemption.category === selectedCategory
      );
    }

    // Filter by search - include points in search
    if (searchFilter) {
      const search = searchFilter.toLowerCase();
      filtered = filtered.filter(redemption =>
        redemption.partner.toLowerCase().includes(search) ||
        redemption.category.toLowerCase().includes(search) ||
        redemption.date.toLowerCase().includes(search) ||
        redemption.redemptionAmount.toString().includes(search)
      );
    }

    return filtered;
  }, [formattedRedemptions, selectedPartner, internalSelectedPartner, selectedCategory, searchFilter, onPartnerChange]);

  const handlePartnerChange = (partner: string) => {
    if (onPartnerChange) {
      onPartnerChange(partner);
    } else {
      setInternalSelectedPartner(partner);
    }
  };

  const currentPartner = onPartnerChange ? selectedPartner : internalSelectedPartner;
  const hasAnyFilter = Boolean(
    (currentPartner && currentPartner !== "all") || 
    (selectedCategory && selectedCategory !== "all") || 
    searchFilter
  );

  const getFilterDisplayText = () => {
    const parts = [];
    if (currentPartner && currentPartner !== "all") {
      parts.push(`Partner: ${currentPartner}`);
    }
    if (selectedCategory && selectedCategory !== "all") {
      parts.push(`Category: ${selectedCategory}`);
    }
    if (searchFilter) {
      parts.push(`Search: "${searchFilter}"`);
    }
    return parts.join(", ");
  };

  const handleClearAllFilters = () => {
    handlePartnerChange("all");
    if (onCategoryChange) {
      onCategoryChange("all");
    }
    setSearchFilter("");
  };

  return (
    <Card className="bg-gradient-to-b from-white to-gray-100">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg sm:text-xl font-semibold" style={{ color: '#00175a' }}>
              Recent redemptions
            </CardTitle>
            
            <RedemptionFilterIndicator
              hasAnyFilter={hasAnyFilter}
              getFilterDisplayText={getFilterDisplayText}
              onClearAllFilters={handleClearAllFilters}
            />
            
            {!hasAnyFilter && (
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                View and filter redemption transactions
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-end gap-3">
          <div className="flex-1 sm:max-w-sm">
            <Input
              placeholder="Search redemptions..."
              value={searchFilter}
              onChange={(event) => setSearchFilter(event.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex justify-end">
            <PartnerFilterDropdown
              selectedPartner={currentPartner}
              partners={uniquePartners}
              onPartnerChange={handlePartnerChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <RedemptionTable redemptions={filteredRedemptions} />
      </CardContent>
    </Card>
  );
}

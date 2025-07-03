
import React from "react";
import { CategoryChartCard } from "./CategoryChartCard";
import { CategoryTransactionCard } from "./CategoryTransactionCard";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { useCategorySpendingData } from "@/hooks/useCategorySpendingData";
import { useFilterState } from "@/hooks/useFilterState";

export function CategorySpendingChart() {
  const { filters, updateFilter, clearAllFilters } = useFilterState("ytd");
  const { 
    chartData, 
    categories, 
    totalSpend, 
    transactionCount,
    swapTransactions 
  } = useCategorySpendingData(filters.selectedTimeRange);

  const handleTimeRangeChange = (newTimeRange: string) => {
    console.log("CategorySpendingChart: Time range changing to:", newTimeRange);
    updateFilter("selectedTimeRange", newTimeRange);
  };

  const handleCategoryChange = (category: string) => {
    console.log("CategorySpendingChart: Category changing to:", category);
    updateFilter("selectedCard", category);
  };

  // Define colors for the chart
  const colors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1", 
    "#d084d0", "#ffb347", "#87ceeb", "#dda0dd", "#98fb98"
  ];

  const getTimeRangeLabel = () => {
    if (filters.selectedTimeRange === "ytd") return "YTD"
    if (filters.selectedTimeRange === "90d") return "Last 90 days"
    if (filters.selectedTimeRange === "30d") return "Last 30 days"
    if (filters.selectedTimeRange === "7d") return "Last 7 days"
    return "YTD"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Insights</h1>
          <p className="text-muted-foreground">
            Analyze spending patterns across different categories
          </p>
        </div>
        <TimeRangeSelector
          timeRange={filters.selectedTimeRange}
          onTimeRangeChange={handleTimeRangeChange}
          swapTransactions={swapTransactions}
        />
      </div>

      {/* Chart Card */}
      <CategoryChartCard
        categoryData={chartData}
        totalSpend={totalSpend}
        timeRange={filters.selectedTimeRange}
        timeRangeLabel={getTimeRangeLabel()}
        colors={colors}
        onTimeRangeChange={handleTimeRangeChange}
        onCategoryClick={handleCategoryChange}
        selectedCategory={filters.selectedCard}
      />

      {/* Transaction Table */}
      <CategoryTransactionCard
        timeRange={filters.selectedTimeRange}
        selectedCategory={filters.selectedCard}
        onCategoryChange={handleCategoryChange}
        onTimeRangeChange={handleTimeRangeChange}
        categories={categories}
      />
    </div>
  );
}

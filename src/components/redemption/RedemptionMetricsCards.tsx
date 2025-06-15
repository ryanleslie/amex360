
import { Plane, MapPin, Calendar, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { FilterState } from "@/hooks/useFilterState";
import { parseRedemptionsCSV, calculateRedemptionStats } from "@/utils/redemptionParser";

interface RedemptionMetricsCardsProps {
  filters: FilterState;
  isVisible: boolean;
  numbersKey: number;
  onCategoryFilter?: (category: string) => void;
  selectedCategory?: string;
}

export function RedemptionMetricsCards({ 
  filters, 
  isVisible, 
  numbersKey,
  onCategoryFilter,
  selectedCategory
}: RedemptionMetricsCardsProps) {
  const redemptions = parseRedemptionsCSV();
  const stats = calculateRedemptionStats(redemptions);

  const getTimeRangeDescription = (selectedTimeRange: string) => {
    if (selectedTimeRange === "ytd") return "(YTD)";
    if (selectedTimeRange === "90d") return "(90d)";
    if (selectedTimeRange === "30d") return "(30d)";
    if (selectedTimeRange === "7d") return "(7d)";
    return "(YTD)";
  };

  // Calculate percentage badges
  const airfarePercentage = stats.totalPointsRedeemed > 0 
    ? Math.round((stats.airfarePoints / stats.totalPointsRedeemed) * 100)
    : 0;
  
  const accommodationPercentage = stats.totalPointsRedeemed > 0 
    ? Math.round((stats.accommodationPoints / stats.totalPointsRedeemed) * 100)
    : 0;

  const avgRedemptionPercentage = stats.totalPointsRedeemed > 0 
    ? Math.round((stats.averageRedemption / stats.totalPointsRedeemed) * 100)
    : 0;

  const handleCardClick = (cardType: string) => {
    if (!onCategoryFilter) return;
    
    if (cardType === "airfare-redemptions") {
      const newCategory = selectedCategory === "Airfare" ? "all" : "Airfare";
      onCategoryFilter(newCategory);
    } else if (cardType === "accommodation-redemptions") {
      const newCategory = selectedCategory === "Accommodation" ? "all" : "Accommodation";
      onCategoryFilter(newCategory);
    }
  };

  const cardData = [
    {
      title: "Points Redeemed",
      value: stats.totalPointsRedeemed,
      badge: "100%",
      icon: () => <img src="https://i.imgur.com/dTz9vVm.png" alt="Points" className="h-4 w-4" />,
      footer: "Award travel",
      description: `${stats.totalBookings} total redemptions ${getTimeRangeDescription(filters.selectedTimeRange)}`,
      clickable: false,
      showHover: true,
      cardType: "total-redeemed",
      formatAsPoints: true
    },
    {
      title: "Airfare",
      value: stats.airfarePoints,
      badge: `${airfarePercentage}%`,
      icon: Plane,
      footer: "Flight bookings",
      description: `${stats.airfareRedemptions} redemptions ${getTimeRangeDescription(filters.selectedTimeRange)}`,
      clickable: true,
      cardType: "airfare-redemptions",
      formatAsPoints: true,
      isSelected: selectedCategory === "Airfare"
    },
    {
      title: "Accommodation",
      value: stats.accommodationPoints,
      badge: `${accommodationPercentage}%`,
      icon: MapPin,
      footer: "Hotel bookings",
      description: `${stats.accommodationRedemptions} redemptions ${getTimeRangeDescription(filters.selectedTimeRange)}`,
      clickable: true,
      cardType: "accommodation-redemptions",
      formatAsPoints: true,
      isSelected: selectedCategory === "Accommodation"
    },
    {
      title: "Avg Redemption",
      value: stats.averageRedemption,
      badge: `${avgRedemptionPercentage}%`,
      icon: TrendingUp,
      footer: "Points per redemption",
      description: `Average redemption ${getTimeRangeDescription(filters.selectedTimeRange)}`,
      clickable: false,
      showHover: true,
      cardType: "avg-redemption",
      formatAsPoints: true
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cardData.map((card, index) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          badge={card.badge}
          icon={card.icon}
          footer={card.footer}
          description={card.description}
          index={index}
          isVisible={isVisible}
          numbersKey={numbersKey}
          clickable={card.clickable}
          showHover={card.showHover}
          cardType={card.cardType}
          formatAsPoints={card.formatAsPoints}
          showBadge={true}
          onClick={card.clickable ? () => handleCardClick(card.cardType) : undefined}
        />
      ))}
    </div>
  );
}

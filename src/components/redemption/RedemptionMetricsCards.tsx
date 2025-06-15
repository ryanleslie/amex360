
import { Plane, MapPin, Calendar, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { FilterState } from "@/hooks/useFilterState";
import { parseRedemptionsCSV, calculateRedemptionStats } from "@/utils/redemptionParser";

interface RedemptionMetricsCardsProps {
  filters: FilterState;
  isVisible: boolean;
  numbersKey: number;
}

export function RedemptionMetricsCards({ 
  filters, 
  isVisible, 
  numbersKey 
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

  const cardData = [
    {
      title: "Points Redeemed",
      value: stats.totalPointsRedeemed,
      badge: "100%",
      icon: () => <img src="https://i.imgur.com/dTz9vVm.png" alt="Points" className="h-4 w-4" />,
      footer: "Total points redeemed",
      description: `Points redeemed ${getTimeRangeDescription(filters.selectedTimeRange)}`,
      clickable: false,
      showHover: true,
      cardType: "total-redeemed"
    },
    {
      title: "Airfare Redemptions",
      value: stats.airfareRedemptions,
      badge: `${airfarePercentage}%`,
      icon: Plane,
      footer: "Flight bookings",
      description: `Airfare redemptions ${getTimeRangeDescription(filters.selectedTimeRange)}`,
      clickable: true,
      cardType: "airfare-redemptions"
    },
    {
      title: "Accommodation Redemptions",
      value: stats.accommodationRedemptions,
      badge: `${accommodationPercentage}%`,
      icon: MapPin,
      footer: "Hotel bookings",
      description: `Accommodation redemptions ${getTimeRangeDescription(filters.selectedTimeRange)}`,
      clickable: true,
      cardType: "accommodation-redemptions"
    },
    {
      title: "Avg Redemption",
      value: stats.averageRedemption,
      badge: `${Math.round(stats.totalPointsRedeemed / stats.totalBookings)} pts`,
      icon: TrendingUp,
      footer: "Points per redemption",
      description: `Average redemption ${getTimeRangeDescription(filters.selectedTimeRange)}`,
      clickable: false,
      cardType: "avg-redemption"
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
          formatAsPoints={card.title.includes("Points") || card.title.includes("Avg")}
          showBadge={true}
        />
      ))}
    </div>
  );
}

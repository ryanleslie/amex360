
import { Plane, MapPin, Calendar, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { FilterState } from "@/hooks/useFilterState";

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
  const getTimeRangeDescription = (selectedTimeRange: string) => {
    if (selectedTimeRange === "ytd") return "(YTD)";
    if (selectedTimeRange === "90d") return "(90d)";
    if (selectedTimeRange === "30d") return "(30d)";
    if (selectedTimeRange === "7d") return "(7d)";
    return "(YTD)";
  };

  const cardData = [
    {
      title: "Points Redeemed",
      value: 485000,
      badge: "+12%",
      icon: () => <img src="https://i.imgur.com/dTz9vVm.png" alt="Points" className="h-4 w-4" />,
      footer: "Total points redeemed",
      description: `Points redeemed ${getTimeRangeDescription(filters.selectedTimeRange)}`,
      clickable: false,
      showHover: true,
      cardType: "total-redeemed"
    },
    {
      title: "Travel Bookings",
      value: 28,
      badge: "+8%",
      icon: Plane,
      footer: "Flight & hotel bookings",
      description: `Travel bookings ${getTimeRangeDescription(filters.selectedTimeRange)}`,
      clickable: true,
      cardType: "travel-bookings"
    },
    {
      title: "Destinations",
      value: 12,
      badge: "+25%",
      icon: MapPin,
      footer: "Unique destinations",
      description: `Destinations visited ${getTimeRangeDescription(filters.selectedTimeRange)}`,
      clickable: true,
      cardType: "destinations"
    },
    {
      title: "Avg Redemption",
      value: 17321,
      badge: "+5%",
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

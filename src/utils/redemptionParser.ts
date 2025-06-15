
import redemptionsCSV from "@/data/redemptions.csv?raw";

export interface RedemptionData {
  date: string;
  description: string;
  category: string;
  destination: string;
  points: number;
}

export interface RedemptionStats {
  totalPointsRedeemed: number;
  totalBookings: number;
  uniqueDestinations: number;
  averageRedemption: number;
}

export function parseRedemptionsCSV(): RedemptionData[] {
  const lines = redemptionsCSV.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    return {
      date: values[0],
      description: values[1],
      category: values[2],
      destination: values[3],
      points: Math.abs(parseInt(values[4])) // Convert to positive number
    };
  });
}

export function calculateRedemptionStats(redemptions: RedemptionData[]): RedemptionStats {
  const totalPointsRedeemed = redemptions.reduce((sum, r) => sum + r.points, 0);
  const totalBookings = redemptions.length;
  const uniqueDestinations = new Set(redemptions.map(r => r.destination)).size;
  const averageRedemption = Math.round(totalPointsRedeemed / totalBookings);

  return {
    totalPointsRedeemed,
    totalBookings,
    uniqueDestinations,
    averageRedemption
  };
}

export function getTopDestinations(redemptions: RedemptionData[], limit: number = 5) {
  const destinationTotals = redemptions.reduce((acc, redemption) => {
    if (!acc[redemption.destination]) {
      acc[redemption.destination] = {
        name: redemption.destination,
        pointsRedeemed: 0,
        trips: 0
      };
    }
    acc[redemption.destination].pointsRedeemed += redemption.points;
    acc[redemption.destination].trips += 1;
    return acc;
  }, {} as Record<string, { name: string; pointsRedeemed: number; trips: number }>);

  return Object.values(destinationTotals)
    .sort((a, b) => b.pointsRedeemed - a.pointsRedeemed)
    .slice(0, limit);
}

export function formatRedemptionsForTable(redemptions: RedemptionData[]) {
  return redemptions.map((redemption, index) => ({
    id: (index + 1).toString(),
    date: redemption.date,
    redemptionAmount: redemption.points,
    partner: redemption.description,
    category: redemption.category.toLowerCase() === 'airfare' ? 'flight' as const : 'hotel' as const,
    value: `$${Math.round(redemption.points * 0.012)}` // Rough estimate of 1.2 cents per point
  }));
}

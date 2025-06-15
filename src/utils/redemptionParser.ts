
import redemptionsCSV from "@/data/redemptions.csv?raw";

export interface RedemptionData {
  date: string;
  description: string;
  category: string;
  points: number;
}

export interface RedemptionStats {
  totalPointsRedeemed: number;
  totalBookings: number;
  uniquePartners: number;
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
      points: Math.abs(parseInt(values[3])) // Convert to positive number
    };
  });
}

export function calculateRedemptionStats(redemptions: RedemptionData[]): RedemptionStats {
  const totalPointsRedeemed = redemptions.reduce((sum, r) => sum + r.points, 0);
  const totalBookings = redemptions.length;
  const uniquePartners = new Set(redemptions.map(r => r.description)).size;
  const averageRedemption = Math.round(totalPointsRedeemed / totalBookings);

  return {
    totalPointsRedeemed,
    totalBookings,
    uniquePartners,
    averageRedemption
  };
}

export function getTopPartners(redemptions: RedemptionData[], limit: number = 5) {
  const partnerTotals = redemptions.reduce((acc, redemption) => {
    if (!acc[redemption.description]) {
      acc[redemption.description] = {
        name: redemption.description,
        pointsRedeemed: 0,
        redemptions: 0
      };
    }
    acc[redemption.description].pointsRedeemed += redemption.points;
    acc[redemption.description].redemptions += 1;
    return acc;
  }, {} as Record<string, { name: string; pointsRedeemed: number; redemptions: number }>);

  return Object.values(partnerTotals)
    .sort((a, b) => b.pointsRedeemed - a.pointsRedeemed)
    .slice(0, limit);
}

export function formatRedemptionsForTable(redemptions: RedemptionData[]) {
  return redemptions.map((redemption, index) => ({
    id: (index + 1).toString(),
    date: redemption.date,
    redemptionAmount: redemption.points,
    partner: redemption.description,
    category: redemption.category
  }));
}

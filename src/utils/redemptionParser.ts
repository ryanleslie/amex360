
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
  airfareRedemptions: number;
  accommodationRedemptions: number;
  airfarePoints: number;
  accommodationPoints: number;
}

export function parseRedemptionsCSV(): RedemptionData[] {
  const lines = redemptionsCSV.trim().split('\n');
  
  return lines.slice(1).map((line, index) => {
    // Split by comma or tab to handle different CSV formats
    const values = line.split(/[,\t]/);
    
    console.log(`Row ${index + 1}:`, values);
    
    // The points value appears to be split across columns 4 and 5 due to comma in the number
    // Reconstruct the points value by combining the split parts
    let pointsString = '';
    if (values[4] && values[5]) {
      // Remove quotes and carriage returns, then combine
      const part1 = values[4].replace(/"/g, '').replace(/\r/g, '');
      const part2 = values[5].replace(/"/g, '').replace(/\r/g, '');
      pointsString = part1 + part2;
    } else if (values[4]) {
      pointsString = values[4].replace(/"/g, '').replace(/\r/g, '');
    }
    
    const pointsValue = parseFloat(pointsString);
    
    console.log(`Points string: "${pointsString}", parsed: ${pointsValue}, isNaN: ${isNaN(pointsValue)}`);
    
    return {
      date: values[0]?.trim(),
      description: values[1]?.trim(),
      category: values[2]?.trim(),
      points: Math.abs(pointsValue) // Apply absolute value to convert negative to positive
    };
  }).filter(redemption => {
    const isValid = !isNaN(redemption.points) && redemption.points > 0;
    if (!isValid) {
      console.log('Filtering out invalid redemption:', redemption);
    }
    return isValid;
  });
}

export function calculateRedemptionStats(redemptions: RedemptionData[]): RedemptionStats {
  const totalPointsRedeemed = redemptions.reduce((sum, r) => sum + r.points, 0);
  const totalBookings = redemptions.length;
  const uniquePartners = new Set(redemptions.map(r => r.description)).size;
  const averageRedemption = Math.round(totalPointsRedeemed / totalBookings);

  // Calculate airfare and accommodation stats
  const airfareRedemptions = redemptions.filter(r => r.category === 'Airfare');
  const accommodationRedemptions = redemptions.filter(r => r.category === 'Accommodation');
  
  const airfarePoints = airfareRedemptions.reduce((sum, r) => sum + r.points, 0);
  const accommodationPoints = accommodationRedemptions.reduce((sum, r) => sum + r.points, 0);

  return {
    totalPointsRedeemed,
    totalBookings,
    uniquePartners,
    averageRedemption,
    airfareRedemptions: airfareRedemptions.length,
    accommodationRedemptions: accommodationRedemptions.length,
    airfarePoints,
    accommodationPoints
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

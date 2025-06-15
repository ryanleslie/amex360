

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
  // Debug: Log the raw CSV content to see what we're actually getting
  console.log("=== CSV DEBUG INFO ===");
  console.log("Raw CSV content (first 1000 chars):", redemptionsCSV.substring(0, 1000));
  console.log("Raw CSV content (full):", redemptionsCSV);
  console.log("CSV content length:", redemptionsCSV.length);
  
  const lines = redemptionsCSV.trim().split('\n');
  console.log("Number of lines:", lines.length);
  console.log("Header line:", lines[0]);
  console.log("First data line:", lines[1]);
  console.log("Second data line:", lines[2]);
  
  // Let's also check what columns the header suggests
  const headerColumns = lines[0].split(',');
  console.log("Header columns:", headerColumns);
  console.log("Expected number of columns:", headerColumns.length);
  
  return lines.slice(1).map((line, index) => {
    // Split by comma to handle CSV format
    const values = line.split(',');
    
    console.log(`Row ${index + 1}:`, values);
    console.log(`Row ${index + 1} length:`, values.length);
    console.log(`Row ${index + 1} raw line:`, line);
    
    // Based on the actual CSV structure we see in the file (4 columns):
    // date, description, category, points
    if (values.length === 4) {
      // Simple 4-column format
      const pointsString = values[3].replace(/"/g, '').replace(/\r/g, '').replace(/,/g, '');
      const pointsValue = parseFloat(pointsString);
      
      console.log(`4-column format - Points string: "${pointsString}", parsed: ${pointsValue}`);
      
      return {
        date: values[0]?.trim() || '',
        description: values[1]?.trim() || '',
        category: values[2]?.trim() || '',
        points: Math.abs(pointsValue)
      };
    } else if (values.length >= 5) {
      // 5+ column format (with destination or split points)
      let pointsString = '';
      if (values[4] && values[5]) {
        // Points split across columns 4 and 5
        const part1 = values[4].replace(/"/g, '').replace(/\r/g, '');
        const part2 = values[5].replace(/"/g, '').replace(/\r/g, '');
        pointsString = part1 + part2;
      } else if (values[4]) {
        pointsString = values[4].replace(/"/g, '').replace(/\r/g, '').replace(/,/g, '');
      }
      
      const pointsValue = parseFloat(pointsString);
      
      console.log(`5+ column format - Points string: "${pointsString}", parsed: ${pointsValue}`);
      
      return {
        date: values[0]?.trim() || '',
        description: values[1]?.trim() || '',
        category: values[2]?.trim() || '',
        points: Math.abs(pointsValue)
      };
    } else {
      console.log(`Unexpected number of columns: ${values.length} for line: ${line}`);
      return {
        date: '',
        description: '',
        category: '',
        points: 0
      };
    }
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

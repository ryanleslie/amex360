
import redemptionsData from '@/data/redemptions.csv?raw';

export interface Redemption {
  id: string;
  date: string;
  description: string;
  category: 'Airfare' | 'Accommodation';
  destination: string;
  points: number;
}

export function parseRedemptions(): Redemption[] {
  const lines = redemptionsData.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    const points = parseInt(values[4].replace(/[",]/g, ''));
    
    return {
      id: (index + 1).toString(),
      date: values[0],
      description: values[1],
      category: values[2] as 'Airfare' | 'Accommodation',
      destination: values[3],
      points: Math.abs(points) // Convert to positive for display
    };
  });
}

export function getRedemptionStats(redemptions: Redemption[]) {
  const totalPoints = redemptions.reduce((sum, r) => sum + r.points, 0);
  const totalBookings = redemptions.length;
  const uniqueDestinations = new Set(redemptions.map(r => r.destination)).size;
  const avgRedemption = Math.round(totalPoints / totalBookings);
  
  return {
    totalPoints,
    totalBookings,
    uniqueDestinations,
    avgRedemption
  };
}

export function getTopDestinations(redemptions: Redemption[]) {
  const destinationMap = new Map<string, { points: number; trips: number }>();
  
  redemptions.forEach(redemption => {
    const existing = destinationMap.get(redemption.destination) || { points: 0, trips: 0 };
    destinationMap.set(redemption.destination, {
      points: existing.points + redemption.points,
      trips: existing.trips + 1
    });
  });
  
  return Array.from(destinationMap.entries())
    .map(([destination, data]) => ({
      id: destination,
      name: destination,
      pointsRedeemed: data.points,
      trips: data.trips,
      category: getDestinationCategory(destination),
      image: getDestinationImage(destination)
    }))
    .sort((a, b) => b.pointsRedeemed - a.pointsRedeemed)
    .slice(0, 5);
}

function getDestinationCategory(destination: string): string {
  const europeanCities = ['Stuttgart', 'Frankfurt', 'Barcelona'];
  return europeanCities.includes(destination) ? 'Europe' : 'Domestic';
}

function getDestinationImage(destination: string): string {
  const imageMap: Record<string, string> = {
    'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=100&h=80&fit=crop',
    'Los Angeles': 'https://images.unsplash.com/photo-1534190239940-9ba8944ea261?w=100&h=80&fit=crop',
    'Phoenix': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=80&fit=crop',
    'Stuttgart': 'https://images.unsplash.com/photo-1539650116574-75c0c6d36b3c?w=100&h=80&fit=crop',
    'Frankfurt': 'https://images.unsplash.com/photo-1539650116574-75c0c6d36b3c?w=100&h=80&fit=crop'
  };
  
  return imageMap[destination] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=80&fit=crop';
}

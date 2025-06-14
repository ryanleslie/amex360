
import { Reward } from "@/types/reward";

export function parseBonusAwardsCsv(rawData: string): Reward[] {
  // Remove Windows \r if present and split lines
  const lines = rawData.trim().replace(/\r/g, '').split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map((line, idx) => {
    const values = line.split(',');
    return {
      id: `bonus-rwd-${idx}`,
      date: values[0] || '',
      award_code: values[1] || '',
      card: values[2] || '',
      last_five: values[3] || '',
      reward_description: values[4] || '',
      points: values[5] ? parseInt(values[5], 10) : 0,
      required_spend: values[6] ? parseInt(values[6], 10) : undefined,
    };
  });
}

import { Reward } from "@/types/reward"

export function parseRewardData(rawData: string): any[] {
  const lines = rawData.trim().split('\n')
  const headers = lines[0].split('\t')
  
  return lines.slice(1).map((line, index) => {
    const values = line.split('\t')
    
    return {
      id: `rwd-${index}`,
      date: values[0] || '',
      award_code: values[1] || '',
      card: values[2] || '',
      reward_description: values[3] || '',
      points: parseInt(values[4]) || 0,
      required_spend: values[5] ? parseInt(values[5]) : undefined
    }
  })
}

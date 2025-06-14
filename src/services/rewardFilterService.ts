import { Reward } from "@/types/reward"
import { FilterState } from "@/hooks/useFilterState"
// Remove import { staticRwdData } from "@/data/staticRwdData"
import bonusAwardsCsv from "@/data/bonus_awards.csv?raw";
import { parseBonusAwardsCsv } from "@/utils/bonusAwardsParser"

export class RewardFilterService {
  private static instance: RewardFilterService
  private allRewards: Reward[]

  private constructor() {
    // Use the CSV parser for the new bonus awards file
    const rawRewards = parseBonusAwardsCsv(bonusAwardsCsv)
    this.allRewards = rawRewards
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((reward, index) => ({
        id: `bonus-rwd-${index}`,
        ...reward
      }))
  }

  public static getInstance(): RewardFilterService {
    if (!RewardFilterService.instance) {
      RewardFilterService.instance = new RewardFilterService()
    }
    return RewardFilterService.instance
  }

  public getAllRewards(): Reward[] {
    return this.allRewards
  }

  public getFilteredRewards(filters: FilterState): Reward[] {
    let filtered = [...this.allRewards]
    
    if (filters.selectedDate) {
      filtered = this.applyDateFilter(filtered, filters.selectedDate)
    } else {
      filtered = this.applyTimeRangeFilter(filtered, filters.selectedTimeRange)
    }

    // Updated: To support new format, extract card and last_five when filtering
    filtered = this.applyCardFilter(filtered, filters.selectedCard)
    return filtered
  }

  private applyTimeRangeFilter(rewards: Reward[], timeRange?: string): Reward[] {
    if (!timeRange || timeRange === "ytd") {
      const today = new Date()
      const startDate = new Date(today.getFullYear(), 0, 1)
      const startDateString = startDate.toISOString().split('T')[0]
      return rewards.filter(reward => reward.date >= startDateString)
    }
    
    const today = new Date()
    let startDate: Date
    if (timeRange === "90d") {
      startDate = new Date(today)
      startDate.setDate(startDate.getDate() - 90)
    } else if (timeRange === "30d") {
      startDate = new Date(today)
      startDate.setDate(today.getDate() - 30)
    } else if (timeRange === "7d") {
      startDate = new Date(today)
      startDate.setDate(today.getDate() - 7)
    } else {
      return rewards
    }
    const startDateString = startDate.toISOString().split('T')[0]
    return rewards.filter(reward => reward.date >= startDateString)
  }

  private applyCardFilter(rewards: Reward[], selectedCard?: string): Reward[] {
    if (!selectedCard || selectedCard === "all") {
      return rewards
    }
    // New logic: selectedCard format is now 'Card Name (-XXXXX)' or just 'Card Name'
    // Let's extract both card and last_five
    const cardMatch = selectedCard.match(/^(.*?)(?: \((-?\d{5})\))?$/);
    const cardName = cardMatch?.[1]?.trim() || selectedCard;
    const lastFive = cardMatch?.[2];

    return rewards.filter(reward =>
      reward.card === cardName && (lastFive ? reward.last_five === lastFive : true)
    )
  }

  private applyDateFilter(rewards: Reward[], selectedDate?: string): Reward[] {
    if (!selectedDate) {
      return rewards
    }
    return rewards.filter(reward => reward.date === selectedDate)
  }

  public getUniqueCardAccounts(): string[] {
    // Unique by card+last_five
    const cardSet = new Set<string>();
    this.allRewards.forEach(r => {
      // Only add last_five if present, else just card name
      if (r.last_five && r.last_five.length > 0) {
        cardSet.add(`${r.card} (${r.last_five})`)
      } else {
        cardSet.add(r.card)
      }
    });
    return Array.from(cardSet).sort();
  }
}

export const rewardFilterService = RewardFilterService.getInstance()

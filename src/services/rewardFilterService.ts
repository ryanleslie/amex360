
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
    return rewards.filter(reward => 
      reward.card === selectedCard
    )
  }

  private applyDateFilter(rewards: Reward[], selectedDate?: string): Reward[] {
    if (!selectedDate) {
      return rewards
    }
    return rewards.filter(reward => reward.date === selectedDate)
  }

  public getUniqueCardAccounts(): string[] {
    const uniqueCards = Array.from(new Set(this.allRewards.map(r => r.card)))
      .filter(card => card.length > 0)
      .sort()
    return uniqueCards
  }
}

export const rewardFilterService = RewardFilterService.getInstance()

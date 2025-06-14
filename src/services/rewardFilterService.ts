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

    // Check if the selectedCard fits our "Card Name (-lastfive)" format
    const lastFiveMatch = selectedCard.match(/^(.*) \(([-\d]+)\)$/)
    if (lastFiveMatch) {
      const cardName = lastFiveMatch[1].trim()
      const lastFive = lastFiveMatch[2].trim()
      return rewards.filter(reward =>
        reward.card === cardName && reward.last_five === lastFive
      )
    }
    // Otherwise fall back to filtering by card name only
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
    // Build a set of unique "card + last_five" combos for rewards that have last_five,
    // otherwise just card name
    const seen = new Set<string>()
    const combos: string[] = []

    for (const reward of this.allRewards) {
      let display: string

      if (reward.last_five && reward.last_five.length > 0) {
        display = `${reward.card} (${reward.last_five})`
      } else {
        display = reward.card
      }
      if (display.length && !seen.has(display)) {
        combos.push(display)
        seen.add(display)
      }
    }
    // Always sort for UI stability
    return combos.sort()
  }
}

export const rewardFilterService = RewardFilterService.getInstance()


// Add the new field for last_five (card suffix)
export interface Reward {
  id: string
  date: string
  award_code: string
  card: string
  last_five?: string
  reward_description: string
  points: number
  required_spend?: number
}

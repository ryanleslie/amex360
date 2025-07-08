// Starting balances as of July 6th, 2025
// These serve as the baseline for real-time balance calculations

export interface StartingBalance {
  cardType: string
  lastFive: string
  plaid_account_id: string
  startingBalance: number
  baselineDate: string // ISO date string
}

export const STARTING_BALANCES: StartingBalance[] = [
  {
    cardType: "Business Classic Gold",
    lastFive: "71002", 
    plaid_account_id: "account_1",
    startingBalance: 2500.00, // Example starting balance - update with actual
    baselineDate: "2025-07-06"
  },
  {
    cardType: "Business Green",
    lastFive: "81017",
    plaid_account_id: "account_2", 
    startingBalance: 1200.00, // Example starting balance - update with actual
    baselineDate: "2025-07-06"
  }
  // Add more cards as needed with their actual July 6th balances
]

export const getStartingBalance = (cardType: string, lastFive: string): StartingBalance | undefined => {
  return STARTING_BALANCES.find(balance => 
    balance.cardType === cardType && balance.lastFive === lastFive
  )
}
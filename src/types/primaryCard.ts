
export interface PrimaryCard {
  cardType: string
  lastFive: string
  isPrimary: boolean
  creditLimit: number
  limitType: string
  partnerMultiple?: number // Make optional since not all cards have partner multiples
  isBrandPartner: boolean
  closingDate: number
  dueDate: number
  interestRate: string
  annualFee: number
  plaid_account_id: string
}

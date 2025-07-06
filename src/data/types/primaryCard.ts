
export interface PrimaryCard {
  cardType: string
  lastFive: string
  displayName: string
  isPrimary: boolean
  creditLimit: number
  limitType: string
  partnerMultiple?: number // Make optional since not all cards have partner multiples
  isBrandPartner: boolean
}

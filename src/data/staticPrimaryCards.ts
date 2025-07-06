
import { transactionFilterService } from "@/services/transaction"

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

// Static configuration for primary cards with manually inputted last 5 digits
export const primaryCardsConfig: PrimaryCard[] = [
  {
    cardType: "Amazon Business Prime",
    lastFive: "52003", // TODO: Update with actual primary card last 5 digits
    displayName: "Amazon Business Prime (-52003)",
    isPrimary: true,
    creditLimit: 6000,
    limitType: "preset",
    partnerMultiple: 5,
    isBrandPartner: true
  },
  {
    cardType: "Bonvoy Business Amex", 
    lastFive: "31009", // TODO: Update with actual primary card last 5 digits
    displayName: "Marriott Bonvoy Business (-31009)",
    isPrimary: true,
    creditLimit: 5000,
    limitType: "preset",
    partnerMultiple: 6,
    isBrandPartner: true
  },
  {
    cardType: "Business Blue Plus I",
    lastFive: "01000", // TODO: Update with actual primary card last 5 digits
    displayName: "Business Blue Plus I (-01000)",
    isPrimary: true,
    creditLimit: 5900,
    limitType: "preset",
    isBrandPartner: false
  },
  {
    cardType: "Business Blue Plus II",
    lastFive: "11009", // TODO: Update with actual primary card last 5 digits
    displayName: "Business Blue Plus II (-11009)",
    isPrimary: true,
    creditLimit: 4000,
    limitType: "preset",
    isBrandPartner: false
  },
  {
    cardType: "Business Classic Gold",
    lastFive: "71002", // TODO: Update with actual primary card last 5 digits
    displayName: "Business Classic Gold (-71002)",
    isPrimary: true,
    creditLimit: 2000,
    limitType: "pay over time",
    isBrandPartner: false
  },
  {
    cardType: "Business Green",
    lastFive: "82007", // TODO: Update with actual primary card last 5 digits
    displayName: "Business Green (-82007)",
    isPrimary: true,
    creditLimit: 30000,
    limitType: "pay over time",
    isBrandPartner: false
  },
  {
    cardType: "Business Platinum Card",
    lastFive: "52007", // TODO: Update with actual primary card last 5 digits
    displayName: "Business Platinum Card (-52007)",
    isPrimary: true,
    creditLimit: 5000,
    limitType: "pay over time",
    isBrandPartner: false
  },
  {
    cardType: "Business Rose Gold",
    lastFive: "02008", // TODO: Update with actual primary card last 5 digits
    displayName: "Business Rose Gold (-02008)",
    isPrimary: true,
    creditLimit: 10000,
    limitType: "pay over time",
    isBrandPartner: false
  },
  {
    cardType: "Business White Gold",
    lastFive: "41000", // TODO: Update with actual primary card last 5 digits
    displayName: "Business White Gold (-41000)",
    isPrimary: true,
    creditLimit: 2000,
    limitType: "pay over time",
    isBrandPartner: false
  },
  {
    cardType: "Charles Schwab Platinum Card",
    lastFive: "71000", // TODO: Update with actual primary card last 5 digits
    displayName: "Charles Schwab Platinum Card (-71000)",
    isPrimary: true,
    creditLimit: 5500,
    limitType: "pay over time",
    isBrandPartner: false
  },
  {
    cardType: "Delta Skymiles Reserve",
    lastFive: "41006", // TODO: Update with actual primary card last 5 digits
    displayName: "Delta Skymiles Reserve (-41006)",
    isPrimary: true,
    creditLimit: 30000,
    limitType: "preset",
    partnerMultiple: 3,
    isBrandPartner: true
  },
  {
    cardType: "Hilton Honors Business",
    lastFive: "91003", // TODO: Update with actual primary card last 5 digits
    displayName: "Hilton Honors Business (-91003)",
    isPrimary: true,
    creditLimit: 5000,
    limitType: "preset",
    partnerMultiple: 12,
    isBrandPartner: true
  },
  {
    cardType: "Platinum Card",
    lastFive: "71003", // TODO: Update with actual primary card last 5 digits
    displayName: "Platinum Card (-71003)",
    isPrimary: true,
    creditLimit: 25000,
    limitType: "pay over time",
    isBrandPartner: false
  }
]

// Helper functions
export function getAllPrimaryCards(): PrimaryCard[] {
  return primaryCardsConfig.filter(card => card.isPrimary)
}

export function getPrimaryCardByType(cardType: string): PrimaryCard | undefined {
  return primaryCardsConfig.find(card => card.cardType === cardType && card.isPrimary)
}

export function getPrimaryCardLastFive(cardType: string): string | undefined {
  const primaryCard = getPrimaryCardByType(cardType)
  return primaryCard?.lastFive
}

export function getPrimaryCardCreditLimit(cardType: string): number | undefined {
  const primaryCard = getPrimaryCardByType(cardType)
  return primaryCard?.creditLimit
}

export function isPrimaryCardBrandPartner(cardType: string): boolean {
  const primaryCard = getPrimaryCardByType(cardType)
  return primaryCard?.isBrandPartner || false
}

export function getBrandPartnerCards(): PrimaryCard[] {
  return primaryCardsConfig.filter(card => card.isPrimary && card.isBrandPartner)
}

export function generateDisplayNameWithLastFive(cardType: string, lastFive?: string): string {
  const primaryCard = getPrimaryCardByType(cardType)
  const actualLastFive = lastFive || primaryCard?.lastFive || "XXXXX"
  
  // Apply same display name formatting as existing logic
  if (cardType === "Bonvoy Business Amex") {
    return `Marriott Bonvoy Business (${actualLastFive})`
  }
  
  return `${cardType} (${actualLastFive})`
}

export function updatePrimaryCardLastFive(cardType: string, newLastFive: string): boolean {
  const cardIndex = primaryCardsConfig.findIndex(card => card.cardType === cardType)
  if (cardIndex === -1) return false
  
  primaryCardsConfig[cardIndex].lastFive = newLastFive
  primaryCardsConfig[cardIndex].displayName = generateDisplayNameWithLastFive(cardType, newLastFive)
  return true
}

export function updatePrimaryCardCreditLimit(cardType: string, newCreditLimit: number): boolean {
  const cardIndex = primaryCardsConfig.findIndex(card => card.cardType === cardType)
  if (cardIndex === -1) return false
  
  primaryCardsConfig[cardIndex].creditLimit = newCreditLimit
  return true
}

// Validation function to ensure all unique card types from transaction data are included
export function validatePrimaryCardsAgainstTransactionData(): {
  valid: boolean
  missingCards: string[]
  extraCards: string[]
} {
  const uniqueCardTypes = transactionFilterService.getUniqueCardAccounts()
  const configuredCardTypes = primaryCardsConfig.map(card => card.cardType)
  
  const missingCards = uniqueCardTypes.filter(cardType => !configuredCardTypes.includes(cardType))
  const extraCards = configuredCardTypes.filter(cardType => !uniqueCardTypes.includes(cardType))
  
  return {
    valid: missingCards.length === 0 && extraCards.length === 0,
    missingCards,
    extraCards
  }
}

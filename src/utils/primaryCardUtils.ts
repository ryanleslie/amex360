
import { PrimaryCard } from "@/types/primaryCard"
import { primaryCardsConfig } from "@/data/config/primaryCardsData"
import { transactionFilterService } from "@/services/transaction"

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

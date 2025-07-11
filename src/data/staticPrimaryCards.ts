
// Main export file for primary cards functionality
export type { PrimaryCard } from "@/types/primaryCard"
export { primaryCardsConfig } from "@/data/primaryCardsData"
export {
  getAllPrimaryCards,
  getPrimaryCardByType,
  getPrimaryCardLastFive,
  getPrimaryCardCreditLimit,
  isPrimaryCardBrandPartner,
  getBrandPartnerCards,
  generateDisplayNameWithLastFive,
  updatePrimaryCardLastFive,
  updatePrimaryCardCreditLimit,
  getPrimaryCardClosingDate,
  getPrimaryCardDueDate,
  getPrimaryCardInterestRate,
  getPrimaryCardAnnualFee,
  validatePrimaryCardsAgainstTransactionData
} from "@/utils/primaryCardUtils"

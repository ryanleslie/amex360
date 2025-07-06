
// Main export file for primary cards functionality
export type { PrimaryCard } from "@/types/primaryCard"
export { primaryCardsConfig } from "@/data/config/primaryCardsData"
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
  validatePrimaryCardsAgainstTransactionData
} from "@/utils/primaryCardUtils"


import { PrimaryCard } from "@/data/types/primaryCard"

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

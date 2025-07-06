
import { PrimaryCard } from "@/types/primaryCard"
import { parsePrimaryCardsCSV } from "@/utils/primaryCardParser"

// Load primary cards from CSV
export const primaryCardsConfig: PrimaryCard[] = parsePrimaryCardsCSV()

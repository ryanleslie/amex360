
import { getCardImage } from "@/utils/cardImageUtils"
import { MetricResult } from "./types"

export const getStaticMetrics = () => {
  // Static business credit limit data
  const businessCreditLimitData: MetricResult = {
    cards: [
      {
        name: "Business Line of Credit",
        lastFive: "-4156",
        amount: "$2,000,000", 
        type: "installment",
        image: getCardImage("bloc")
      },
    ]
  }

  return {
    businessCreditLimitData
  }
}

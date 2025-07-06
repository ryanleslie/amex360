
export interface MetricCardData {
  name: string
  lastFive: string
  amount: string
  type: string
  image: string
  limitType?: string
  multiple?: string
  creditLimit?: number
  annualFee?: number
}

export interface MetricData {
  title: string
  value: string
  description: string
  dataSource: string
  lastUpdated: string
  calculationMethod: string
  cardData: MetricCardData[] | null
}

export interface MetricResult {
  amount?: string
  count?: number
  cards: MetricCardData[]
}

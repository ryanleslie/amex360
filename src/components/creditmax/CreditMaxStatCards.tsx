import React from "react"
import { TrendingUp, TrendingDown, Crown } from "lucide-react"
import { StatCard } from "@/components/StatCard"
import { formatPointMultiple } from "@/utils/pointMultipleUtils"

interface SwapTransaction {
  date: string
  counterparty: string
  amount: number
  direction: 'SWAP_IN' | 'SWAP_OUT'
  multiple?: number
  card?: string
}

interface CreditMaxStatCardsProps {
  swapTransactions: SwapTransaction[]
}

export function CreditMaxStatCards({ swapTransactions }: CreditMaxStatCardsProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [numbersKey, setNumbersKey] = React.useState(0)

  React.useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  React.useEffect(() => {
    // Reset and re-trigger number animation when transactions change
    setNumbersKey(prev => prev + 1)
  }, [swapTransactions])

  // Calculate metrics from swap transactions
  const metrics = React.useMemo(() => {
    const outboundTransactions = swapTransactions.filter(t => t.direction === 'SWAP_OUT')
    const outboundWithCard = swapTransactions.filter(t => t.direction === 'SWAP_OUT' && t.card && t.card.trim() !== '')
    const totalCardSpend = outboundWithCard.reduce((sum, t) => sum + t.amount, 0)
    const totalPointsEarned = outboundTransactions.reduce((sum, t) => sum + (t.amount * t.multiple), 0)
    const actualSpend = totalCardSpend * 0.03
    const truePointMultiple = actualSpend > 0 ? totalPointsEarned / actualSpend : 0
    const pointsEarnedMultiple = totalCardSpend > 0 ? totalPointsEarned / totalCardSpend : 0

    return {
      totalPointsEarned: Math.round(totalPointsEarned),
      totalCardSpend,
      actualSpend,
      truePointMultiple,
      pointsEarnedMultiple
    }
  }, [swapTransactions])

  const cardData = [
    {
      title: "Total Points",
      value: metrics.totalPointsEarned,
      badge: formatPointMultiple(metrics.pointsEarnedMultiple),
      icon: () => <img src="https://i.imgur.com/dTz9vVm.png" alt="Points" className="h-4 w-4" />,
      footer: "Points earned",
      description: "Total points from outbound swaps",
      formatAsPoints: true,
      isPointMultiple: false
    },
    {
      title: "Total Card Spend",
      value: metrics.totalCardSpend,
      badge: "100%",
      icon: TrendingUp,
      footer: "Card charges",
      description: "Total outbound swaps via card",
      formatAsPoints: false,
      isPointMultiple: false
    },
    {
      title: "Actual Spend",
      value: metrics.actualSpend,
      badge: metrics.totalCardSpend > 0 ? `${Math.round((metrics.actualSpend / metrics.totalCardSpend) * 100)}%` : "0%",
      icon: TrendingDown,
      footer: "Actual cost",
      description: "Card processing (3%)",
      formatAsPoints: false,
      isPointMultiple: false
    },
    {
      title: "Actual Points/Dollar",
      value: metrics.truePointMultiple,
      badge: `${metrics.truePointMultiple.toFixed(1)}x`,
      icon: Crown,
      footer: "CreditMax multiple",
      description: "Points earned on actual spend",
      formatAsPoints: false,
      isPointMultiple: true
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cardData.map((card, index) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          badge={card.badge}
          icon={card.icon}
          footer={card.footer}
          description={card.description}
          index={index}
          isVisible={isVisible}
          numbersKey={numbersKey}
          formatAsPoints={card.formatAsPoints}
          isPointMultiple={card.isPointMultiple}
          showBadge={true}
          showHover={true}
        />
      ))}
    </div>
  )
}

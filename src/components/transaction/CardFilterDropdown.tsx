
import { CreditCard, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatAccountName } from "@/utils/transactionUtils"

interface CardFilterDropdownProps {
  selectedCard: string | undefined
  creditCards: string[]
  onCardChange: (card: string) => void
  showBusinessPrefix?: boolean // New prop to control business prefix
}

// Accept new display format with last five for every card
export function CardFilterDropdown({ selectedCard, creditCards, onCardChange, showBusinessPrefix = false }: CardFilterDropdownProps) {
  const getDisplayText = () => {
    if (!selectedCard || selectedCard === "all") {
      return "All Cards"
    }
    // Already formatted as "Card Name (-XXXXX)"
    const prefix = showBusinessPrefix ? "Business " : ""
    return `${prefix}${selectedCard}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto md:ml-auto focus:ring-0 focus:ring-offset-0">
          <CreditCard className="mr-2 h-4 w-4" />
          {getDisplayText()}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          checked={!selectedCard || selectedCard === "all"}
          onCheckedChange={() => onCardChange("all")}
        >
          All Cards
        </DropdownMenuCheckboxItem>
        {creditCards.map((card) => (
          <DropdownMenuCheckboxItem
            key={card}
            checked={selectedCard === card}
            onCheckedChange={() => onCardChange(card)}
          >
            {showBusinessPrefix ? `Business ${card}` : card}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

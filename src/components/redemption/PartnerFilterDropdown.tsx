
import { ChevronDown, PlaneTakeoff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PartnerFilterDropdownProps {
  selectedPartner: string
  partners: string[]
  onPartnerChange: (partner: string) => void
}

// Helper function to format partner names with proper capitalization
const formatPartnerName = (name: string): string => {
  return name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export function PartnerFilterDropdown({ 
  selectedPartner, 
  partners, 
  onPartnerChange 
}: PartnerFilterDropdownProps) {
  const getDisplayText = () => {
    if (!selectedPartner || selectedPartner === "all") {
      return "All Partners"
    }
    return formatPartnerName(selectedPartner)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto md:ml-auto focus:ring-0 focus:ring-offset-0">
          <PlaneTakeoff className="mr-2 h-4 w-4" />
          {getDisplayText()}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuCheckboxItem
          checked={!selectedPartner || selectedPartner === "all"}
          onCheckedChange={() => onPartnerChange("all")}
        >
          All Partners
        </DropdownMenuCheckboxItem>
        {partners.map((partner) => (
          <DropdownMenuCheckboxItem
            key={partner}
            checked={selectedPartner === partner}
            onCheckedChange={() => onPartnerChange(partner)}
          >
            {formatPartnerName(partner)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

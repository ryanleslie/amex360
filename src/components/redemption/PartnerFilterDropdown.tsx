
import { Building2, ChevronDown } from "lucide-react"
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

export function PartnerFilterDropdown({ 
  selectedPartner, 
  partners, 
  onPartnerChange 
}: PartnerFilterDropdownProps) {
  const getDisplayText = () => {
    if (!selectedPartner || selectedPartner === "all") {
      return "All Partners"
    }
    return selectedPartner
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto md:ml-auto focus:ring-0 focus:ring-offset-0">
          <Building2 className="mr-2 h-4 w-4" />
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
            {partner}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

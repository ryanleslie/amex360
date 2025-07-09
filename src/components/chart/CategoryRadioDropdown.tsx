import * as React from "react"
import { ChevronDown } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface CategoryRadioDropdownProps {
  selectedCategory: string
  categories: string[]
  onCategoryChange: (category: string) => void
}

export function CategoryRadioDropdown({
  selectedCategory,
  categories,
  onCategoryChange,
}: CategoryRadioDropdownProps) {
  const [open, setOpen] = React.useState(false)

  const getDisplayText = () => {
    if (selectedCategory === "all") return "All categories"
    return selectedCategory
  }

  const sortedCategories = React.useMemo(() => {
    return [...categories].sort()
  }, [categories])

  const handleValueChange = (value: string) => {
    onCategoryChange(value)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-background"
        >
          {getDisplayText()}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-4" align="end">
        <RadioGroup value={selectedCategory} onValueChange={handleValueChange}>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="cursor-pointer">
                All categories
              </Label>
            </div>
            {sortedCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <RadioGroupItem value={category} id={category} />
                <Label htmlFor={category} className="cursor-pointer text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </PopoverContent>
    </Popover>
  )
}

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CategoryFilterDropdownProps {
  selectedCategory: string
  categories: string[]
  onCategoryChange: (category: string) => void
}

export function CategoryFilterDropdown({
  selectedCategory,
  categories,
  onCategoryChange,
}: CategoryFilterDropdownProps) {
  const getDisplayText = () => {
    if (selectedCategory === "all") return "All categories"
    return selectedCategory
  }

  // Sort categories alphabetically for display
  const sortedCategories = [...categories].sort((a, b) => a.localeCompare(b))

  return (
    <Select value={selectedCategory} onValueChange={onCategoryChange}>
      <SelectTrigger className="w-[200px] bg-white">
        <SelectValue>{getDisplayText()}</SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white border shadow-lg max-h-[300px] overflow-y-auto z-50">
        <SelectItem value="all" className="hover:bg-gray-100">
          All categories
        </SelectItem>
        {sortedCategories.map((category) => (
          <SelectItem 
            key={category} 
            value={category}
            className="hover:bg-gray-100"
          >
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

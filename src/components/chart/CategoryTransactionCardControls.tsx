
import * as React from "react"
import { Input } from "@/components/ui/input"
import { CategoryFilterDropdown } from "./CategoryFilterDropdown"

interface CategoryTransactionCardControlsProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  selectedCategory: string
  categories: string[]
  onCategoryChange: (category: string) => void
}

export function CategoryTransactionCardControls({
  globalFilter,
  onGlobalFilterChange,
  selectedCategory,
  categories,
  onCategoryChange,
}: CategoryTransactionCardControlsProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <Input
        placeholder="Filter transactions..."
        value={globalFilter ?? ""}
        onChange={(event) => onGlobalFilterChange(event.target.value)}
        className="max-w-sm"
      />
      <CategoryFilterDropdown
        selectedCategory={selectedCategory}
        categories={categories}
        onCategoryChange={onCategoryChange}
      />
    </div>
  )
}

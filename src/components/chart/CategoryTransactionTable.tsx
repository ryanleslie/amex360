
import * as React from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import { Transaction } from "@/types/transaction"
import { useCategoryTransactionColumns } from "./CategoryTransactionColumns"
import { CategoryTransactionTableContent } from "./CategoryTransactionTableContent"
import { CategoryTransactionPagination } from "./CategoryTransactionPagination"

interface CategoryTransactionTableProps {
  transactions: Transaction[]
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
}

export function CategoryTransactionTable({ 
  transactions, 
  globalFilter, 
  onGlobalFilterChange 
}: CategoryTransactionTableProps) {
  const [showAll, setShowAll] = React.useState(false)
  const columns = useCategoryTransactionColumns()
  
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data: transactions,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: onGlobalFilterChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    globalFilterFn: (row, columnId, value) => {
      const search = value.toLowerCase()
      return (
        row.original.description.toLowerCase().includes(search) ||
        (row.original.category || '').toLowerCase().includes(search) ||
        (row.original.account || row.original.account_type || '').toLowerCase().includes(search)
      )
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const handleShowAll = () => {
    setShowAll(true)
    table.setPageSize(table.getFilteredRowModel().rows.length)
  }

  const handleShowPaginated = () => {
    setShowAll(false)
    table.setPageSize(10)
  }

  const filteredRowCount = table.getFilteredRowModel().rows.length

  return (
    <>
      <CategoryTransactionTableContent 
        table={table} 
        showAll={showAll} 
        columnsLength={columns.length} 
      />
      <CategoryTransactionPagination
        table={table}
        showAll={showAll}
        filteredRowCount={filteredRowCount}
        onShowAll={handleShowAll}
        onShowPaginated={handleShowPaginated}
      />
    </>
  )
}

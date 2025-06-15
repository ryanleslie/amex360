
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
import { RedemptionTableContent } from "./RedemptionTableContent"
import { RedemptionPagination } from "./RedemptionPagination"
import { useRedemptionColumns } from "./RedemptionColumns"

interface FormattedRedemption {
  id: string;
  date: string;
  redemptionAmount: number;
  partner: string;
  category: 'flight' | 'hotel';
  value: string;
}

interface RedemptionTableProps {
  redemptions: FormattedRedemption[]
}

export function RedemptionTable({ redemptions }: RedemptionTableProps) {
  const [showAll, setShowAll] = React.useState(false)
  const columns = useRedemptionColumns()
  
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data: redemptions,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
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
    initialState: {
      pagination: {
        pageSize: 4,
      },
    },
  })

  const handleShowAll = () => {
    setShowAll(true)
    table.setPageSize(table.getFilteredRowModel().rows.length)
  }

  const handleShowPaginated = () => {
    setShowAll(false)
    table.setPageSize(4)
  }

  const filteredRowCount = table.getFilteredRowModel().rows.length

  return (
    <>
      <RedemptionTableContent 
        table={table} 
        showAll={showAll} 
        columnsLength={columns.length} 
      />
      <RedemptionPagination
        table={table}
        showAll={showAll}
        filteredRowCount={filteredRowCount}
        onShowAll={handleShowAll}
        onShowPaginated={handleShowPaginated}
      />
    </>
  )
}

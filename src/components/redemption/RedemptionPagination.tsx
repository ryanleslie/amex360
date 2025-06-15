
import * as React from "react"
import { Table as ReactTable } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

interface FormattedRedemption {
  id: string;
  date: string;
  redemptionAmount: number;
  partner: string;
  category: 'flight' | 'hotel';
  value: string;
}

interface RedemptionPaginationProps {
  table: ReactTable<FormattedRedemption>
  showAll: boolean
  filteredRowCount: number
  onShowAll: () => void
  onShowPaginated: () => void
}

export function RedemptionPagination({ 
  table, 
  showAll, 
  filteredRowCount, 
  onShowAll, 
  onShowPaginated 
}: RedemptionPaginationProps) {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">
          {showAll 
            ? `Showing all ${filteredRowCount} results`
            : `Showing ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to ${Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredRowCount)} of ${filteredRowCount} results`
          }
        </p>
        {!showAll && filteredRowCount > 4 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onShowAll}
          >
            Show All
          </Button>
        )}
        {showAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={onShowPaginated}
          >
            Show Paginated
          </Button>
        )}
      </div>
      
      {!showAll && (
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex w-[120px] items-center justify-center text-sm font-medium whitespace-nowrap">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

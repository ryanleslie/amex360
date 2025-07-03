
import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Transaction } from "@/types/transaction"
import { useAuth } from "@/contexts/AuthContext"

export const useCategoryTransactionColumns = (): ColumnDef<Transaction>[] => {
  const { isAdmin } = useAuth()

  return React.useMemo(() => {
    const columns: ColumnDef<Transaction>[] = [
      {
        accessorKey: "date",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Date
              <ChevronsUpDown />
            </Button>
          )
        },
        cell: ({ row }) => {
          const dateString = row.getValue("date") as string;
          const [year, month, day] = dateString.split('-').map(Number);
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          
          return (
            <div className="text-sm text-center">
              {monthNames[month - 1]} {day}
            </div>
          );
        },
        size: 60,
      }
    ];

    // Only show description column for admin users
    if (isAdmin()) {
      columns.push({
        accessorKey: "description",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Description
              <ChevronsUpDown />
            </Button>
          )
        },
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate text-sm font-medium">
            {row.getValue("description")}
          </div>
        ),
        filterFn: "includesString",
      });
    }

    // Add remaining columns
    columns.push(
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.getValue("category") || "Uncategorized"}
          </div>
        ),
      },
      {
        accessorKey: "account_type",
        header: "Card",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.getValue("account_type")}
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"))
          const absAmount = Math.abs(amount)
          
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(absAmount)
          
          const displayAmount = amount >= 0 ? `+${formatted}` : formatted
          const textColor = amount >= 0 ? "text-[#008767]" : ""

          return (
            <div className={`text-right font-medium tabular-nums text-sm ${textColor}`}>
              {displayAmount}
            </div>
          )
        },
      },
      {
        accessorKey: "point_multiple",
        header: () => <div className="text-right">Multiple</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"))
          const multiple = row.getValue("point_multiple") as number
          
          // If amount is positive (credit), show blank
          if (amount >= 0) {
            return <div className="text-right font-medium"></div>
          }
          
          // If amount is negative (charge), show the multiple
          return (
            <div className="text-right font-medium">
              {multiple}x
            </div>
          )
        },
      }
    );

    return columns;
  }, [isAdmin]);
}

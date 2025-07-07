
import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export interface EmployeeTransaction {
  date: string
  description: string
  card_type: string
  last_five: string
  amount: number
  point_multiple: number
}

export const useEmployeeTransactionColumns = (): ColumnDef<EmployeeTransaction>[] => {
  const { isAdmin } = useAuth()

  return React.useMemo(() => {
    const columns: ColumnDef<EmployeeTransaction>[] = [
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
    if (isAdmin) {
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
        accessorKey: "card_type",
        header: "Card Type",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.getValue("card_type")}
          </div>
        ),
      },
      {
        accessorKey: "last_five",
        header: "Last 5",
        cell: ({ row }) => (
          <div className="text-sm font-mono">
            {row.getValue("last_five")}
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"))
          const absAmount = Math.abs(amount)
          
          // Format the absolute amount
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(absAmount)
          
          // Add prefix based on whether it's positive (credit/payment) or negative (charge/debit)
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
          const multiple = row.getValue("point_multiple") as number
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

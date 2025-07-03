
import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Transaction } from "@/types/transaction"

export const useCategoryTransactionColumns = (): ColumnDef<Transaction>[] => {
  return React.useMemo(() => [
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
    },
    {
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
        <div className="max-w-[300px] truncate text-sm font-medium">
          {row.getValue("description")}
        </div>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return (
          <div className="text-sm text-muted-foreground">
            {category || "Uncategorized"}
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Math.abs(amount))

        return (
          <div className={`text-right font-medium tabular-nums text-sm ${
            amount < 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            {amount < 0 ? `-${formatted}` : `+${formatted}`}
          </div>
        )
      },
    },
    {
      accessorKey: "account_type",
      header: "Account",
      cell: ({ row }) => {
        const account = row.getValue("account_type") as string || row.original.account as string;
        return (
          <div className="text-sm">
            {account ? account.replace(/['"]/g, '') : ""}
          </div>
        );
      },
    },
  ], []);
}

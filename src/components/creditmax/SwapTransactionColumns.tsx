
import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SwapTransaction } from "@/utils/swapParser"

export const useSwapTransactionColumns = (): ColumnDef<SwapTransaction>[] => {
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
        const date = new Date(dateString);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        return (
          <div className="text-sm text-center">
            {monthNames[date.getMonth()]} {date.getDate()}
          </div>
        );
      },
      size: 60,
    },
    {
      accessorKey: "counterparty",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Counterparty
            <ChevronsUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate text-sm font-medium">
          {row.getValue("counterparty")}
        </div>
      ),
      filterFn: "includesString",
    },
    {
      accessorKey: "direction",
      header: "Direction",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue("direction") === "SWAP_IN" ? "In" : "Out"}
        </div>
      ),
    },
    {
      accessorKey: "card",
      header: "Card",
      cell: ({ row }) => {
        const cardValue = row.getValue("card")
        // Show nothing if empty or falsy, else show the value
        return (
          <div className="text-sm">
            {cardValue ? cardValue : ""}
          </div>
        )
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
        }).format(amount)

        return (
          <div className="text-right font-medium tabular-nums text-sm">
            {formatted}
          </div>
        )
      },
    },
    {
      accessorKey: "multiple",
      header: () => <div className="text-right">Multiple</div>,
      cell: ({ row }) => {
        const multiple = row.getValue("multiple") as number | undefined
        // Show nothing if it's undefined, null, zero, or empty; else add "x"
        return (
          <div className="text-right font-medium">
            {multiple ? `${multiple}x` : ""}
          </div>
        )
      },
    },
  ], []);
}


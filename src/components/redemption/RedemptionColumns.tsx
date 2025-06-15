
import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FormattedRedemption {
  id: string;
  date: string;
  redemptionAmount: number;
  partner: string;
  category: string;
}

export const useRedemptionColumns = (): ColumnDef<FormattedRedemption>[] => {
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
      accessorKey: "partner",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Partner
            <ChevronsUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate text-sm font-medium">
          {row.getValue("partner")}
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
            {category}
          </div>
        );
      },
    },
    {
      accessorKey: "redemptionAmount",
      header: () => <div className="text-right">Points</div>,
      cell: ({ row }) => {
        const points = row.getValue("redemptionAmount") as number;
        const formatted = points.toLocaleString();

        return (
          <div className="text-right font-medium tabular-nums text-sm">
            {formatted} pts
          </div>
        )
      },
    },
  ], []);
}

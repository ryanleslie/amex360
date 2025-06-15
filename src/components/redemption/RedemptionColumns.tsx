
import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ChevronsUpDown, Plane, Hotel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FormattedRedemption {
  id: string;
  date: string;
  redemptionAmount: number;
  partner: string;
  category: 'flight' | 'hotel';
  value: string;
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
          <div className="flex items-center gap-2">
            {category === "flight" ? (
              <Plane className="h-4 w-4 text-blue-500" />
            ) : (
              <Hotel className="h-4 w-4 text-green-500" />
            )}
            <Badge variant="outline" className="text-xs">
              {category === "flight" ? "Flight" : "Hotel"}
            </Badge>
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
    {
      accessorKey: "value",
      header: () => <div className="text-right">Value</div>,
      cell: ({ row }) => {
        const value = row.getValue("value") as string;

        return (
          <div className="text-right font-medium tabular-nums text-sm text-green-600">
            {value}
          </div>
        )
      },
    },
  ], []);
}

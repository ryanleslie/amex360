
import * as React from "react"
import { Table as TanstackTable, flexRender } from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Reward } from "@/types/reward"

interface RewardTableContentProps {
  table: TanstackTable<Reward>
  showAll: boolean
  columnsLength: number
}

export function RewardTableContent({ table, showAll, columnsLength }: RewardTableContentProps) {
  // Regular table for all cases
  const tableContent = (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columnsLength} className="h-24 text-center">
              No rewards found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )

  return (
    <div className="rounded-md border">
      {showAll ? (
        <ScrollArea className="h-[600px]">
          {tableContent}
        </ScrollArea>
      ) : (
        tableContent
      )}
    </div>
  )
}

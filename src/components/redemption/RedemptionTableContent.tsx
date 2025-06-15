import * as React from "react"
import { Table as ReactTable, flexRender } from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FormattedRedemption {
  id: string;
  date: string;
  redemptionAmount: number;
  partner: string;
  category: string;
}

interface RedemptionTableContentProps {
  table: ReactTable<FormattedRedemption>
  showAll: boolean
  columnsLength: number
}

export function RedemptionTableContent({ table, showAll, columnsLength }: RedemptionTableContentProps) {
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
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columnsLength}
              className="h-24 text-center"
            >
              No results.
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

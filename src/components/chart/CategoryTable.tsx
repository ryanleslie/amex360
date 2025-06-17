
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

interface CategoryTableProps {
  categoryData: CategoryData[];
  colors: string[];
  timeRangeLabel: string;
}

export function CategoryTable({ categoryData, colors, timeRangeLabel }: CategoryTableProps) {
  return (
    <Card className="bg-gradient-to-b from-white to-gray-100 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Categories</CardTitle>
        <CardDescription>
          Spending detail by category {timeRangeLabel}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <style>
            {`
              .scroll-container {
                scrollbar-width: thin;
                scrollbar-color: transparent transparent;
              }
              .scroll-container:hover {
                scrollbar-color: #d1d5db transparent;
              }
              .scroll-container::-webkit-scrollbar {
                width: 6px;
              }
              .scroll-container::-webkit-scrollbar-track {
                background: transparent;
              }
              .scroll-container::-webkit-scrollbar-thumb {
                background-color: transparent;
                border-radius: 20px;
                transition: background-color 0.2s ease;
              }
              .scroll-container:hover::-webkit-scrollbar-thumb {
                background-color: #d1d5db;
              }
            `}
          </style>
          <div className="scroll-container overflow-y-auto max-h-96">
            <Table>
              <TableBody>
                {categoryData?.length ? (
                  categoryData.map((category, index) => (
                    <TableRow key={category.category} className="h-11">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: colors[index % colors.length] }}
                          />
                          <span className="font-medium">{category.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{category.percentage}%</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          ${category.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center"
                    >
                      No data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

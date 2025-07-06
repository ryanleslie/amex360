
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
  onCategoryClick?: (category: string) => void;
  selectedCategory?: string;
}

export function CategoryTable({ 
  categoryData, 
  colors, 
  timeRangeLabel, 
  onCategoryClick,
  selectedCategory 
}: CategoryTableProps) {
  return (
    <Card className="bg-gradient-to-b from-white to-gray-100 md:col-span-1 lg:col-span-2">
      <CardHeader className="px-3 md:px-4 lg:px-6">
        <CardTitle className="text-lg md:text-xl font-semibold">Categories</CardTitle>
        <CardDescription className="text-sm">
          Spending detail by category {timeRangeLabel}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 md:px-4 lg:px-6">
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
                width: 4px;
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
          <div className="scroll-container overflow-y-auto max-h-[200px] sm:max-h-[250px] md:max-h-[280px] lg:max-h-96">
            <Table>
              <TableBody>
                {categoryData?.length ? (
                  categoryData.map((category, index) => (
                    <TableRow 
                      key={category.category} 
                      className={`h-10 md:h-11 cursor-pointer transition-colors ${
                        selectedCategory === category.category 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => onCategoryClick?.(category.category)}
                    >
                      <TableCell className="py-2 pr-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div 
                            className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0" 
                            style={{ 
                              backgroundColor: colors[index % colors.length],
                              border: selectedCategory === category.category ? '2px solid #000' : 'none'
                            }}
                          />
                          <span className="font-medium text-xs md:text-sm truncate">{category.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-2 px-1">
                        <span className="font-medium text-xs md:text-sm whitespace-nowrap">{category.percentage}%</span>
                      </TableCell>
                      <TableCell className="text-right py-2 pl-1">
                        <span className="font-medium text-xs md:text-sm whitespace-nowrap">
                          ${category.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-sm"
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

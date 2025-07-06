
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
    <Card className="bg-gradient-to-b from-white to-gray-100 lg:col-span-2 w-full min-w-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Categories</CardTitle>
        <CardDescription>
          Spending detail by category {timeRangeLabel}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <div className="rounded-md border">
          <div className="overflow-y-auto max-h-[280px] sm:max-h-[320px]">
            <Table>
              <TableBody>
                {categoryData?.length ? (
                  categoryData.map((category, index) => (
                    <TableRow 
                      key={category.category} 
                      className={`h-11 cursor-pointer transition-colors ${
                        selectedCategory === category.category 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => onCategoryClick?.(category.category)}
                    >
                      <TableCell className="py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ 
                              backgroundColor: colors[index % colors.length],
                              border: selectedCategory === category.category ? '2px solid #000' : 'none'
                            }}
                          />
                          <span className="font-medium truncate">{category.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-2 w-16">
                        <span className="font-medium text-sm">{category.percentage}%</span>
                      </TableCell>
                      <TableCell className="text-right py-2 w-20">
                        <span className="font-medium text-sm">
                          ${category.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
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

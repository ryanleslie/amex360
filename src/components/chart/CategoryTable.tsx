
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
              .animate-row {
                animation: fadeInUp 0.4s ease-out forwards;
                opacity: 0;
                transform: translateY(10px);
              }
              @keyframes fadeInUp {
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
          </style>
          <div className="scroll-container overflow-y-auto max-h-96">
            <Table>
              <TableBody>
                {categoryData?.length ? (
                  categoryData.map((category, index) => (
                    <TableRow 
                      key={category.category} 
                      className={`h-11 cursor-pointer transition-all duration-200 ease-in-out animate-row ${
                        selectedCategory === category.category 
                          ? 'bg-blue-50 border-blue-200 scale-[1.02]' 
                          : 'hover:bg-gray-50 hover:scale-[1.01]'
                      }`}
                      style={{ 
                        animationDelay: `${index * 50}ms`,
                        transformOrigin: 'center'
                      }}
                      onClick={() => onCategoryClick?.(category.category)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0 transition-all duration-200" 
                            style={{ 
                              backgroundColor: colors[index % colors.length],
                              border: selectedCategory === category.category ? '2px solid #000' : 'none',
                              transform: selectedCategory === category.category ? 'scale(1.2)' : 'scale(1)'
                            }}
                          />
                          <span className="font-medium transition-colors duration-200">
                            {category.category}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium transition-colors duration-200">
                          {category.percentage}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium transition-colors duration-200">
                          ${category.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center animate-fade-in"
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

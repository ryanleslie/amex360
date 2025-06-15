
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Redemption {
  id: string;
  date: string;
  redemptionAmount: number;
  partner: string;
  category: "flight" | "hotel";
  value: string;
}

interface RedemptionTableProps {
  redemptions: Redemption[];
}

export function RedemptionTable({ redemptions }: RedemptionTableProps) {
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    return category === "flight" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";
  };

  return (
    <ScrollArea className="h-[300px] rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Partner</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {redemptions.map((redemption) => (
            <TableRow key={redemption.id}>
              <TableCell className="font-medium">
                {formatDate(redemption.date)}
              </TableCell>
              <TableCell className="font-medium" style={{ color: '#00175a' }}>
                -{redemption.redemptionAmount.toLocaleString()}
              </TableCell>
              <TableCell className="max-w-[150px] truncate">
                {redemption.partner}
              </TableCell>
              <TableCell>
                <Badge className={getCategoryColor(redemption.category)}>
                  {redemption.category}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium text-green-600">
                {redemption.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

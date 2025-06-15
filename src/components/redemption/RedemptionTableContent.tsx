
import React from "react";

interface RedemptionRow {
  date: string;
  amount: number;
  partner: string;
  category: string;
  value: number; // USD
  destination: string;
}

interface RedemptionTableContentProps {
  data: RedemptionRow[];
}

export function RedemptionTableContent({ data }: RedemptionTableContentProps) {
  return (
    <div className="overflow-x-auto rounded-md border bg-white">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider text-gray-600">Date</th>
            <th className="px-3 py-3 text-right text-xs font-semibold tracking-wider text-gray-600">Points</th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider text-gray-600">Partner/Vendor</th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider text-gray-600">Category</th>
            <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider text-gray-600">Destination</th>
            <th className="px-3 py-3 text-right text-xs font-semibold tracking-wider text-gray-600">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.length ? data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition">
              <td className="px-3 py-3 text-left text-sm tabular-nums whitespace-nowrap">
                {new Date(row.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </td>
              <td className="px-3 py-3 text-right text-sm font-semibold text-blue-700 tabular-nums">
                {row.amount.toLocaleString()}
              </td>
              <td className="px-3 py-3 text-left text-sm">{row.partner}</td>
              <td className="px-3 py-3 text-left text-sm">{row.category}</td>
              <td className="px-3 py-3 text-left text-sm">{row.destination}</td>
              <td className="px-3 py-3 text-right text-sm">${row.value.toLocaleString()}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-400">No redemptions found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

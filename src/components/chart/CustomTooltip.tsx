
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

export function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/80 p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{data.category}</p>
        <p className="text-sm text-muted-foreground">
          ${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
}

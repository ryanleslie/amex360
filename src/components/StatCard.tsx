
import * as React from "react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StatCardProps {
  title: string
  value: number
  badge: string
  icon: React.ComponentType<{ className?: string }>
  footer: string
  description: string
  index: number
  isVisible: boolean
  numbersKey: number
  clickable?: boolean
  showHover?: boolean
  cardType?: string
  topCardAccount?: string
  onClick?: (cardType: string, topCardAccount?: string) => void
  formatAsPoints?: boolean
  showBadge?: boolean
}

export function StatCard({
  title,
  value,
  badge,
  icon: IconComponent,
  footer,
  description,
  index,
  isVisible,
  numbersKey,
  clickable = false,
  showHover = false,
  cardType,
  topCardAccount,
  onClick,
  formatAsPoints = false,
  showBadge = true
}: StatCardProps) {
  const handleClick = () => {
    if (clickable && cardType && onClick) {
      onClick(cardType, topCardAccount);
    }
  };

  const formatValue = (val: number) => {
    if (formatAsPoints) {
      const formattedValue = val.toLocaleString('en-US');
      // Add 'x' suffix for "Avg Points/Dollar" card
      if (title === "Avg Points/Dollar") {
        return `${formattedValue}x`;
      }
      return formattedValue;
    }
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getCardClasses = () => {
    const baseClasses = "relative bg-gradient-to-b from-white to-gray-100";
    
    if (clickable) {
      return `${baseClasses} cursor-pointer hover:shadow-lg transition-shadow duration-200`;
    } else if (showHover) {
      return `${baseClasses} hover:shadow-lg transition-shadow duration-200`;
    }
    
    return baseClasses;
  };

  return (
    <Card 
      className={getCardClasses()}
      onClick={handleClick}
    >
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardDescription>{title}</CardDescription>
          {showBadge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <CardTitle 
          key={`${title}-${numbersKey}`}
          className={`text-2xl font-semibold tabular-nums lg:text-3xl transition-opacity duration-1000 ease-in-out ${
            isVisible ? 'animate-fade-in' : 'opacity-0'
          }`}
          style={formatAsPoints ? { color: '#00175a' } : undefined}
        >
          {formatValue(value)}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0 pb-6">
        <div className="flex gap-2 font-medium items-center">
          {footer} <IconComponent className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          {description}
        </div>
      </CardFooter>
    </Card>
  );
}

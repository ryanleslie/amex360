// Custom global filter function for descriptions and amounts
export const globalFilterFn = (row: any, columnId: string, value: string) => {
  const description = String(row.getValue("description")).toLowerCase()
  const amount = String(row.getValue("amount")).toLowerCase()
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(parseFloat(row.getValue("amount")))).toLowerCase()
  const pointMultiple = row.getValue("point_multiple")
  const actualAmount = parseFloat(row.getValue("amount"))
  
  const searchValue = value.toLowerCase().trim()
  
  // Handle special case for point multiple search with "x" suffix
  if (searchValue.endsWith('x') && searchValue.length > 1) {
    const numberPart = searchValue.slice(0, -1)
    if (!isNaN(Number(numberPart))) {
      // Exclude payments and credits (positive amounts or payment descriptions)
      const isPaymentOrCredit = actualAmount > 0 || description.includes('payment') || description.includes('credit')
      if (isPaymentOrCredit) {
        return false
      }
      return pointMultiple === Number(numberPart)
    }
  }
  
  // Regular search across all fields
  const pointMultipleStr = String(pointMultiple || "").toLowerCase()
  
  return description.includes(searchValue) || 
         amount.includes(searchValue) || 
         formattedAmount.includes(searchValue) ||
         pointMultipleStr.includes(searchValue)
}

// Function to format account names according to the rules
export const formatAccountName = (accountName: string | undefined | null): string => {
  // Handle undefined, null, or empty string cases
  if (!accountName) {
    return ''
  }
  
  let formatted = accountName.replace(/\bcard\b/gi, '').trim()
  
  // Apply conditional formatting rules
  formatted = formatted.replace(/business/gi, '').trim()
  formatted = formatted.replace(/rewards/gi, '').trim()
  formatted = formatted.replace(/charles/gi, '').trim()
  
  // Clean up extra spaces
  formatted = formatted.replace(/\s+/g, ' ').trim()
  
  return formatted
}

// Standard formatter to remove "Card" and extra terms from display name
export const formatDisplayCardName = (cardName: string | undefined | null): string => {
  if (!cardName) return "";
  let formatted = cardName.replace(/\bcard\b/gi, "").replace(/\s+/g, " ").trim();
  // You can further clean up other terms here if wanted, e.g. .replace(/rewards/gi, '')
  return formatted;
}

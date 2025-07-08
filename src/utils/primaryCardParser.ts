
import { PrimaryCard } from "@/types/primaryCard"
import primaryCardsCSV from "@/data/primary_cards.csv?raw"

export function parsePrimaryCardsCSV(): PrimaryCard[] {
  const lines = primaryCardsCSV.trim().split('\n')
  const headers = lines[0].split(',')
  
  return lines.slice(1).map(line => {
    const values = line.split(',')
    const card: any = {}
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim()
      
      switch (header.trim()) {
        case 'cardType':
          card.cardType = value
          break
        case 'lastFive':
          card.lastFive = value
          break
        case 'isPrimary':
          card.isPrimary = value.toLowerCase() === 'true'
          break
        case 'creditLimit':
          card.creditLimit = parseInt(value) || 0
          break
        case 'limitType':
          card.limitType = value
          break
        case 'isBrandPartner':
          card.isBrandPartner = value.toLowerCase() === 'true'
          break
        case 'partnerMultiple':
          card.partnerMultiple = value && value !== '' ? parseInt(value) : undefined
          break
        case 'closingDate':
          card.closingDate = parseInt(value) || 0
          break
        case 'dueDate':
          card.dueDate = parseInt(value) || 0
          break
        case 'interestRate':
          card.interestRate = value
          break
        case 'annualFee':
          card.annualFee = parseInt(value) || 0
          break
        case 'startingBalance':
          card.startingBalance = parseFloat(value) || 0
          break
        case 'startingDate':
          card.startingDate = value
          break
        case 'plaid_account_id':
          card.plaid_account_id = value
          break
      }
    })
    
    return card as PrimaryCard
  })
}

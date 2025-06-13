import { Transaction } from "@/types/transaction"
import { parseTransactionData } from "@/utils/transactionParser"

export class TransactionDataProcessor {
  private static extractLastFive(account: string): string {
    // Extract last 5 characters from account name, or use a fallback
    const cleanAccount = account.replace(/\s+/g, '').toLowerCase()
    if (cleanAccount.length >= 5) {
      return cleanAccount.slice(-5)
    }
    // Generate a consistent 4-digit code for shorter account names
    let hash = 0
    for (let i = 0; i < cleanAccount.length; i++) {
      hash = ((hash << 5) - hash + cleanAccount.charCodeAt(i)) & 0xffffffff
    }
    return Math.abs(hash % 10000).toString().padStart(4, '0')
  }

  public static processStaticData(): Transaction[] {
    // Use the parseTransactionData function which now loads from CSV
    const rawTransactions = parseTransactionData()
    
    return rawTransactions
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((transaction, index) => ({
        id: `txn-${index}`,
        user_id: 'static-user', // Mock user_id for static data
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount,
        account_type: transaction.account_type, // Use new account_type field
        last_five: transaction.last_five || this.extractLastFive(transaction.account_type), // Use parsed last_five or fallback
        category: transaction.category,
        point_multiple: transaction.point_multiple || 1.0, // Use parsed point_multiple or default
        // Keep legacy fields for backward compatibility
        account: transaction.account_type, // Map account_type to legacy account field
        card_type: transaction.account_type
      }))
  }

  public static getUniqueCardAccounts(transactions: Transaction[]): string[] {
    const uniqueCards = Array.from(new Set(transactions.map(t => t.account_type)))
      .filter(card => card && card.length > 0)
      .sort()
    return uniqueCards
  }
}

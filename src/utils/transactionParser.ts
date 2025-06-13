
import masterTransactionsCsv from "@/data/master_transactions.csv?raw"

export const parseTransactionData = (data?: string) => {
  // Use the imported CSV data if no data is provided
  const csvData = data || masterTransactionsCsv
  
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.slice(1).map(line => {
    // Handle CSV parsing with potential commas in quoted fields
    const values = parseCSVLine(line);
    
    // Map CSV columns to expected format with default values
    const transaction: any = {
      date: '',
      description: '',
      amount: 0,
      account_type: '',
      last_five: '', // Default empty string instead of undefined
      category: '',
      point_multiple: 1.0
    };
    
    headers.forEach((header, index) => {
      const value = values[index]?.replace(/"/g, '').trim() || '';
      
      // Map headers to the expected field names
      switch (header.toLowerCase()) {
        case 'date':
          transaction.date = value;
          break;
        case 'description':
          transaction.description = value;
          break;
        case 'amount':
          transaction.amount = parseFloat(value.replace(/[$,]/g, '')) || 0;
          break;
        case 'account_type':
        case 'account':
          transaction.account_type = value;
          transaction.account = value; // Keep legacy field
          break;
        case 'last_five':
          transaction.last_five = value;
          break;
        case 'category':
          transaction.category = value;
          break;
        case 'point_multiple':
          transaction.point_multiple = parseFloat(value) || 1.0;
          break;
      }
    });
    
    return transaction;
  });
};

// Helper function to parse CSV line with proper comma handling
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

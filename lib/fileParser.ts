import * as XLSX from 'xlsx';
import { TransactionData, IncomeStatementData, BalanceSheetData } from '@/types/financial';

export interface ParsedFileData {
  transactions: TransactionData[];
  incomeData?: Partial<IncomeStatementData>;
  balanceData?: Partial<BalanceSheetData>;
  rawData: Record<string, unknown>[];
}

export function parseCSV(content: string): Record<string, unknown>[] {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/['"]/g, ''));
    const row: Record<string, unknown> = {};
    
    headers.forEach((header, idx) => {
      const value = values[idx] || '';
      const numValue = parseFloat(value.replace(/[$,]/g, ''));
      row[header] = isNaN(numValue) ? value : numValue;
    });
    
    return row;
  });
}

export function parseExcel(file: File): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet) as Record<string, unknown>[];
        
        // Normalize keys to lowercase
        const normalizedData = jsonData.map(row => {
          const normalizedRow: Record<string, unknown> = {};
          Object.keys(row).forEach(key => {
            normalizedRow[key.toLowerCase().trim()] = row[key];
          });
          return normalizedRow;
        });
        
        resolve(normalizedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export async function parseFile(file: File): Promise<ParsedFileData> {
  let rawData: Record<string, unknown>[] = [];
  
  if (file.name.endsWith('.csv')) {
    const text = await file.text();
    rawData = parseCSV(text);
  } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
    rawData = await parseExcel(file);
  } else {
    throw new Error('Unsupported file format. Please upload CSV or Excel files.');
  }

  const transactions = convertToTransactions(rawData);
  const incomeData = extractIncomeData(rawData);
  const balanceData = extractBalanceData(rawData);

  return {
    transactions,
    incomeData,
    balanceData,
    rawData,
  };
}

function convertToTransactions(data: Record<string, unknown>[]): TransactionData[] {
  return data
    .filter(row => {
      // Check if this looks like transaction data
      const hasAmount = 'amount' in row || 'value' in row || 'total' in row;
      const hasType = 'type' in row || 'income' in row || 'expense' in row || 'category' in row;
      return hasAmount && (hasType || 'description' in row);
    })
    .map(row => {
      const amount = Number(row.amount || row.value || row.total || 0);
      const isExpense = 
        (row.type as string)?.toLowerCase() === 'expense' ||
        (row.category as string)?.toLowerCase().includes('expense') ||
        amount < 0;
      
      return {
        date: String(row.date || new Date().toISOString().split('T')[0]),
        description: String(row.description || row.name || row.item || 'Unknown'),
        category: String(row.category || row.type || 'Uncategorized'),
        type: isExpense ? 'expense' : 'income',
        amount: Math.abs(amount),
      };
    });
}

function extractIncomeData(data: Record<string, unknown>[]): Partial<IncomeStatementData> | undefined {
  // Try to detect income statement format
  const hasRevenueFields = data.some(row => 
    'sales' in row || 'revenue' in row || 'services' in row
  );
  
  if (!hasRevenueFields) return undefined;

  const result: Partial<IncomeStatementData> = {
    revenue: { sales: 0, service: 0, other: 0 },
    expenses: {
      costOfGoodSold: 0,
      salaries: 0,
      rent: 0,
      utilities: 0,
      marketing: 0,
      depreciation: 0,
      other: 0,
    },
  };

  data.forEach(row => {
    // Revenue
    if ('sales' in row) result.revenue!.sales = Number(row.sales) || 0;
    if ('revenue' in row) result.revenue!.sales = Number(row.revenue) || 0;
    if ('services' in row) result.revenue!.service = Number(row.services) || 0;
    
    // Expenses
    if ('cogs' in row || 'cost of goods sold' in row) {
      result.expenses!.costOfGoodSold = Number(row.cogs || row['cost of goods sold']) || 0;
    }
    if ('salaries' in row || 'wages' in row) {
      result.expenses!.salaries = Number(row.salaries || row.wages) || 0;
    }
    if ('rent' in row) result.expenses!.rent = Number(row.rent) || 0;
    if ('utilities' in row) result.expenses!.utilities = Number(row.utilities) || 0;
    if ('marketing' in row) result.expenses!.marketing = Number(row.marketing) || 0;
    if ('depreciation' in row) result.expenses!.depreciation = Number(row.depreciation) || 0;
  });

  return result;
}

function extractBalanceData(data: Record<string, unknown>[]): Partial<BalanceSheetData> | undefined {
  // Try to detect balance sheet format
  const hasAssetFields = data.some(row => 
    'cash' in row || 'assets' in row || 'inventory' in row
  );
  
  if (!hasAssetFields) return undefined;

  const result: Partial<BalanceSheetData> = {
    assets: {
      cash: 0,
      accountsReceivable: 0,
      inventory: 0,
      prepaidExpenses: 0,
      propertyEquipment: 0,
      otherAssets: 0,
    },
    liabilities: {
      accountsPayable: 0,
      shortTermDebt: 0,
      accruedExpenses: 0,
      longTermDebt: 0,
      otherLiabilities: 0,
    },
    equity: {
      commonStock: 0,
      retainedEarnings: 0,
      additionalPaidInCapital: 0,
      ownersInvestment: 0,
      ownersDrawings: 0,
    },
  };

  data.forEach(row => {
    if ('cash' in row) result.assets!.cash = Number(row.cash) || 0;
    if ('inventory' in row) result.assets!.inventory = Number(row.inventory) || 0;
    if ('accounts receivable' in row || 'receivables' in row) {
      result.assets!.accountsReceivable = Number(row['accounts receivable'] || row.receivables) || 0;
    }
    if ('accounts payable' in row || 'payables' in row) {
      result.liabilities!.accountsPayable = Number(row['accounts payable'] || row.payables) || 0;
    }
  });

  return result;
}

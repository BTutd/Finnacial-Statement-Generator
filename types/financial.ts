export interface IncomeStatementData {
    companyName: string;
    period: string;
    revenue: {
        sales: number;
        service: number;
        other: number;
    }
    expenses: {
        costOfGoodSold: number;
        salaries:number;
        rent:number;
        utilities:number;
        marketing: number;
        depreciation: number;
        other: number
    }
}

export interface BalanceSheetData {
  companyName: string;
  asOfDate: string;
  assets: {
    cash: number;
    accountsReceivable: number;
    inventory: number;
    prepaidExpenses: number;
    propertyEquipment: number;
    otherAssets: number;
  };
  liabilities: {
    accountsPayable: number;
    shortTermDebt: number;
    accruedExpenses: number;
    longTermDebt: number;
    otherLiabilities: number;
  };
  equity: {
    commonStock: number;
    retainedEarnings: number;
    additionalPaidInCapital: number;
    ownersInvestment: number;
    ownersDrawings: number;
  };
}

export interface CashFlowData {
  companyName: string;
  period: string;
  operating: {
    netIncome: number;
    depreciation: number;
    accountsReceivableChange: number;
    inventoryChange: number;
    accountsPayableChange: number;
    otherOperating: number;
  };
  investing: {
    propertyPurchases: number;
    propertySales: number;
    investmentPurchases: number;
    investmentSales: number;
    otherInvesting: number;
  };
  financing: {
    debtIssuance: number;
    debtRepayment: number;
    stockIssuance: number;
    dividendsPaid: number;
    otherFinancing: number;
  };
  beginningCash: number;
}

export interface OwnersEquityData {
  companyName: string;
  period: string;
  beginningCapital: number;
  ownersInvestment: number;
  netIncome: number;
  ownersDrawings: number;
}

export interface TransactionData {
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  expensesByCategory: Record<string, number>;
  incomeByCategory: Record<string, number>;
  monthlyData: {
    month: string;
    income: number;
    expenses: number;
    netProfit: number;
  }[];
}

export type StatementType = 'income' | 'balance' | 'cashflow' | 'equity' | 'summary';

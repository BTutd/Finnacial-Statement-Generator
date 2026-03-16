import { IncomeStatementData, BalanceSheetData, CashFlowData, TransactionData, FinancialSummary, OwnersEquityData } from '@/types/financial';

export function calculateIncomeStatement(data: IncomeStatementData) {
  const totalRevenue = data.revenue.sales + data.revenue.service + data.revenue.other;
  
  const totalExpenses = 
    data.expenses.costOfGoodSold +
    data.expenses.salaries +
    data.expenses.rent +
    data.expenses.utilities +
    data.expenses.marketing +
    data.expenses.depreciation +
    data.expenses.other;

  const grossProfit = totalRevenue - data.expenses.costOfGoodSold;
  const operatingExpenses = totalExpenses - data.expenses.costOfGoodSold;
  const operatingIncome = grossProfit - operatingExpenses;
  const netIncome = operatingIncome;

  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const netMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

  return {
    totalRevenue,
    totalExpenses,
    grossProfit,
    operatingExpenses,
    operatingIncome,
    netIncome,
    grossMargin,
    netMargin,
  };
}

export function calculateBalanceSheet(data: BalanceSheetData) {
  const totalCurrentAssets = 
    data.assets.cash +
    data.assets.accountsReceivable +
    data.assets.inventory +
    data.assets.prepaidExpenses;

  const totalNonCurrentAssets = 
    data.assets.propertyEquipment +
    data.assets.otherAssets;

  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  const totalCurrentLiabilities = 
    data.liabilities.accountsPayable +
    data.liabilities.shortTermDebt +
    data.liabilities.accruedExpenses;

  const totalLongTermLiabilities = 
    data.liabilities.longTermDebt +
    data.liabilities.otherLiabilities;

  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

  const totalEquity = 
    data.equity.commonStock +
    data.equity.retainedEarnings +
    data.equity.additionalPaidInCapital;

  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  const currentRatio = totalCurrentLiabilities > 0 ? totalCurrentAssets / totalCurrentLiabilities : 0;
  const debtToEquity = totalEquity > 0 ? totalLiabilities / totalEquity : 0;
  const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01;

  return {
    totalCurrentAssets,
    totalNonCurrentAssets,
    totalAssets,
    totalCurrentLiabilities,
    totalLongTermLiabilities,
    totalLiabilities,
    totalEquity,
    totalLiabilitiesAndEquity,
    currentRatio,
    debtToEquity,
    isBalanced,
  };
}

export function calculateCashFlow(data: CashFlowData) {
  const operatingCashFlow = 
    data.operating.netIncome +
    data.operating.depreciation -
    data.operating.accountsReceivableChange -
    data.operating.inventoryChange +
    data.operating.accountsPayableChange +
    data.operating.otherOperating;

  const investingCashFlow = 
    -data.investing.propertyPurchases +
    data.investing.propertySales -
    data.investing.investmentPurchases +
    data.investing.investmentSales +
    data.investing.otherInvesting;

  const financingCashFlow = 
    data.financing.debtIssuance -
    data.financing.debtRepayment +
    data.financing.stockIssuance -
    data.financing.dividendsPaid +
    data.financing.otherFinancing;

  const netCashChange = operatingCashFlow + investingCashFlow + financingCashFlow;
  const endingCash = data.beginningCash + netCashChange;

  return {
    operatingCashFlow,
    investingCashFlow,
    financingCashFlow,
    netCashChange,
    endingCash,
  };
}

export function calculateFinancialSummary(transactions: TransactionData[]): FinancialSummary {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  const expensesByCategory: Record<string, number> = {};
  const incomeByCategory: Record<string, number> = {};

  transactions.forEach(t => {
    if (t.type === 'expense') {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    } else {
      incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
    }
  });

  // Group by month
  const monthlyMap: Record<string, { income: number; expenses: number }> = {};
  
  transactions.forEach(t => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { income: 0, expenses: 0 };
    }
    
    if (t.type === 'income') {
      monthlyMap[monthKey].income += t.amount;
    } else {
      monthlyMap[monthKey].expenses += t.amount;
    }
  });

  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      netProfit: data.income - data.expenses,
    }));

  return {
    totalIncome,
    totalExpenses,
    netProfit,
    profitMargin,
    expensesByCategory,
    incomeByCategory,
    monthlyData,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function calculateOwnersEquity(data: OwnersEquityData) {
  const totalAdditions = data.ownersInvestment + data.netIncome;
  const totalDeductions = data.ownersDrawings;
  const endingCapital = data.beginningCapital + totalAdditions - totalDeductions;

  return {
    totalAdditions,
    totalDeductions,
    endingCapital,
  };
}

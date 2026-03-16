import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { 
  IncomeStatementData, 
  BalanceSheetData, 
  CashFlowData, 
  FinancialSummary 
} from '@/types/financial';
import { 
  calculateIncomeStatement, 
  calculateBalanceSheet, 
  calculateCashFlow,
  formatCurrency, 
  formatPercentage 
} from './calculations';

export function exportIncomeStatementPDF(data: IncomeStatementData): void {
  const doc = new jsPDF();
  const calc = calculateIncomeStatement(data);
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.companyName || 'Company Name', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Income Statement', 105, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Period: ${data.period || 'N/A'}`, 105, 38, { align: 'center' });

  // Revenue Section
  autoTable(doc, {
    startY: 45,
    head: [['Revenue', 'Amount']],
    body: [
      ['Sales Revenue', formatCurrency(data.revenue.sales)],
      ['Service Revenue', formatCurrency(data.revenue.service)],
      ['Other Revenue', formatCurrency(data.revenue.other)],
      [{ content: 'Total Revenue', styles: { fontStyle: 'bold' } }, { content: formatCurrency(calc.totalRevenue), styles: { fontStyle: 'bold' } }],
    ],
    theme: 'striped',
    headStyles: { fillColor: [34, 47, 62] },
  });

  // Expenses Section
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [['Expenses', 'Amount']],
    body: [
      ['Cost of Goods Sold', formatCurrency(data.expenses.costOfGoodSold)],
      ['Salaries & Wages', formatCurrency(data.expenses.salaries)],
      ['Rent', formatCurrency(data.expenses.rent)],
      ['Utilities', formatCurrency(data.expenses.utilities)],
      ['Marketing', formatCurrency(data.expenses.marketing)],
      ['Depreciation', formatCurrency(data.expenses.depreciation)],
      ['Other Expenses', formatCurrency(data.expenses.other)],
      [{ content: 'Total Expenses', styles: { fontStyle: 'bold' } }, { content: formatCurrency(calc.totalExpenses), styles: { fontStyle: 'bold' } }],
    ],
    theme: 'striped',
    headStyles: { fillColor: [34, 47, 62] },
  });

  // Summary
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [['Summary', 'Amount']],
    body: [
      ['Gross Profit', formatCurrency(calc.grossProfit)],
      ['Operating Income', formatCurrency(calc.operatingIncome)],
      [{ content: 'Net Income', styles: { fontStyle: 'bold' } }, { content: formatCurrency(calc.netIncome), styles: { fontStyle: 'bold' } }],
      ['Gross Margin', formatPercentage(calc.grossMargin)],
      ['Net Margin', formatPercentage(calc.netMargin)],
    ],
    theme: 'striped',
    headStyles: { fillColor: [22, 163, 74] },
  });

  doc.save(`income-statement-${data.period || 'export'}.pdf`);
}

export function exportBalanceSheetPDF(data: BalanceSheetData): void {
  const doc = new jsPDF();
  const calc = calculateBalanceSheet(data);
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.companyName || 'Company Name', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Balance Sheet', 105, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`As of: ${data.asOfDate || 'N/A'}`, 105, 38, { align: 'center' });

  // Assets
  autoTable(doc, {
    startY: 45,
    head: [['Assets', 'Amount']],
    body: [
      ['Cash', formatCurrency(data.assets.cash)],
      ['Accounts Receivable', formatCurrency(data.assets.accountsReceivable)],
      ['Inventory', formatCurrency(data.assets.inventory)],
      ['Prepaid Expenses', formatCurrency(data.assets.prepaidExpenses)],
      [{ content: 'Total Current Assets', styles: { fontStyle: 'bold' } }, { content: formatCurrency(calc.totalCurrentAssets), styles: { fontStyle: 'bold' } }],
      ['Property & Equipment', formatCurrency(data.assets.propertyEquipment)],
      ['Other Assets', formatCurrency(data.assets.otherAssets)],
      [{ content: 'Total Assets', styles: { fontStyle: 'bold' } }, { content: formatCurrency(calc.totalAssets), styles: { fontStyle: 'bold' } }],
    ],
    theme: 'striped',
    headStyles: { fillColor: [34, 47, 62] },
  });

  // Liabilities & Equity
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [['Liabilities & Equity', 'Amount']],
    body: [
      ['Accounts Payable', formatCurrency(data.liabilities.accountsPayable)],
      ['Short-term Debt', formatCurrency(data.liabilities.shortTermDebt)],
      ['Accrued Expenses', formatCurrency(data.liabilities.accruedExpenses)],
      [{ content: 'Total Current Liabilities', styles: { fontStyle: 'bold' } }, { content: formatCurrency(calc.totalCurrentLiabilities), styles: { fontStyle: 'bold' } }],
      ['Long-term Debt', formatCurrency(data.liabilities.longTermDebt)],
      ['Other Liabilities', formatCurrency(data.liabilities.otherLiabilities)],
      [{ content: 'Total Liabilities', styles: { fontStyle: 'bold' } }, { content: formatCurrency(calc.totalLiabilities), styles: { fontStyle: 'bold' } }],
      ['Common Stock', formatCurrency(data.equity.commonStock)],
      ['Retained Earnings', formatCurrency(data.equity.retainedEarnings)],
      ['Additional Paid-in Capital', formatCurrency(data.equity.additionalPaidInCapital)],
      [{ content: 'Total Equity', styles: { fontStyle: 'bold' } }, { content: formatCurrency(calc.totalEquity), styles: { fontStyle: 'bold' } }],
      [{ content: 'Total L & E', styles: { fontStyle: 'bold' } }, { content: formatCurrency(calc.totalLiabilitiesAndEquity), styles: { fontStyle: 'bold' } }],
    ],
    theme: 'striped',
    headStyles: { fillColor: [34, 47, 62] },
  });

  doc.save(`balance-sheet-${data.asOfDate || 'export'}.pdf`);
}

export function exportCashFlowPDF(data: CashFlowData): void {
  const doc = new jsPDF();
  const calc = calculateCashFlow(data);
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.companyName || 'Company Name', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Statement of Cash Flows', 105, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Period: ${data.period || 'N/A'}`, 105, 38, { align: 'center' });

  // Operating Activities
  autoTable(doc, {
    startY: 45,
    head: [['Operating Activities', 'Amount']],
    body: [
      ['Net Income', formatCurrency(data.operating.netIncome)],
      ['Depreciation', formatCurrency(data.operating.depreciation)],
      ['Change in A/R', formatCurrency(-data.operating.accountsReceivableChange)],
      ['Change in Inventory', formatCurrency(-data.operating.inventoryChange)],
      ['Change in A/P', formatCurrency(data.operating.accountsPayableChange)],
      ['Other Operating', formatCurrency(data.operating.otherOperating)],
      [{ content: 'Net Cash from Operations', styles: { fontStyle: 'bold' } }, { content: formatCurrency(calc.operatingCashFlow), styles: { fontStyle: 'bold' } }],
    ],
    theme: 'striped',
    headStyles: { fillColor: [34, 47, 62] },
  });

  // Investing Activities
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [['Investing Activities', 'Amount']],
    body: [
      ['Property Purchases', formatCurrency(-data.investing.propertyPurchases)],
      ['Property Sales', formatCurrency(data.investing.propertySales)],
      ['Investment Purchases', formatCurrency(-data.investing.investmentPurchases)],
      ['Investment Sales', formatCurrency(data.investing.investmentSales)],
      [{ content: 'Net Cash from Investing', styles: { fontStyle: 'bold' } }, { content: formatCurrency(calc.investingCashFlow), styles: { fontStyle: 'bold' } }],
    ],
    theme: 'striped',
    headStyles: { fillColor: [34, 47, 62] },
  });

  // Financing Activities
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [['Financing Activities', 'Amount']],
    body: [
      ['Debt Issuance', formatCurrency(data.financing.debtIssuance)],
      ['Debt Repayment', formatCurrency(-data.financing.debtRepayment)],
      ['Stock Issuance', formatCurrency(data.financing.stockIssuance)],
      ['Dividends Paid', formatCurrency(-data.financing.dividendsPaid)],
      [{ content: 'Net Cash from Financing', styles: { fontStyle: 'bold' } }, { content: formatCurrency(calc.financingCashFlow), styles: { fontStyle: 'bold' } }],
    ],
    theme: 'striped',
    headStyles: { fillColor: [34, 47, 62] },
  });

  // Summary
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [['Cash Summary', 'Amount']],
    body: [
      ['Beginning Cash', formatCurrency(data.beginningCash)],
      ['Net Change in Cash', formatCurrency(calc.netCashChange)],
      [{ content: 'Ending Cash', styles: { fontStyle: 'bold' } }, { content: formatCurrency(calc.endingCash), styles: { fontStyle: 'bold' } }],
    ],
    theme: 'striped',
    headStyles: { fillColor: [22, 163, 74] },
  });

  doc.save(`cash-flow-statement-${data.period || 'export'}.pdf`);
}

export function exportSummaryPDF(summary: FinancialSummary, companyName: string): void {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName || 'Company Name', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Financial Summary Report', 105, 30, { align: 'center' });

  // Key Metrics
  autoTable(doc, {
    startY: 40,
    head: [['Key Metrics', 'Value']],
    body: [
      ['Total Income', formatCurrency(summary.totalIncome)],
      ['Total Expenses', formatCurrency(summary.totalExpenses)],
      ['Net Profit', formatCurrency(summary.netProfit)],
      ['Profit Margin', formatPercentage(summary.profitMargin)],
    ],
    theme: 'striped',
    headStyles: { fillColor: [22, 163, 74] },
  });

  // Income by Category
  const incomeData = Object.entries(summary.incomeByCategory).map(([category, amount]) => [
    category, formatCurrency(amount as number)
  ]);
  
  if (incomeData.length > 0) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Income by Category', 'Amount']],
      body: incomeData,
      theme: 'striped',
      headStyles: { fillColor: [34, 47, 62] },
    });
  }

  // Expenses by Category
  const expenseData = Object.entries(summary.expensesByCategory).map(([category, amount]) => [
    category, formatCurrency(amount as number)
  ]);
  
  if (expenseData.length > 0) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Expenses by Category', 'Amount']],
      body: expenseData,
      theme: 'striped',
      headStyles: { fillColor: [220, 38, 38] },
    });
  }

  doc.save(`financial-summary-${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportToExcel(
  incomeData?: IncomeStatementData,
  balanceData?: BalanceSheetData,
  cashFlowData?: CashFlowData,
  summary?: FinancialSummary
): void {
  const workbook = XLSX.utils.book_new();

  if (incomeData) {
    const calc = calculateIncomeStatement(incomeData);
    const incomeSheet = XLSX.utils.aoa_to_sheet([
      ['Income Statement'],
      ['Company:', incomeData.companyName],
      ['Period:', incomeData.period],
      [],
      ['Revenue'],
      ['Sales Revenue', incomeData.revenue.sales],
      ['Service Revenue', incomeData.revenue.service],
      ['Other Revenue', incomeData.revenue.other],
      ['Total Revenue', calc.totalRevenue],
      [],
      ['Expenses'],
      ['Cost of Goods Sold', incomeData.expenses.costOfGoodSold],
      ['Salaries & Wages', incomeData.expenses.salaries],
      ['Rent', incomeData.expenses.rent],
      ['Utilities', incomeData.expenses.utilities],
      ['Marketing', incomeData.expenses.marketing],
      ['Depreciation', incomeData.expenses.depreciation],
      ['Other Expenses', incomeData.expenses.other],
      ['Total Expenses', calc.totalExpenses],
      [],
      ['Summary'],
      ['Gross Profit', calc.grossProfit],
      ['Operating Income', calc.operatingIncome],
      ['Net Income', calc.netIncome],
      ['Gross Margin', `${calc.grossMargin.toFixed(1)}%`],
      ['Net Margin', `${calc.netMargin.toFixed(1)}%`],
    ]);
    XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Income Statement');
  }

  if (balanceData) {
    const calc = calculateBalanceSheet(balanceData);
    const balanceSheet = XLSX.utils.aoa_to_sheet([
      ['Balance Sheet'],
      ['Company:', balanceData.companyName],
      ['As of:', balanceData.asOfDate],
      [],
      ['Assets'],
      ['Cash', balanceData.assets.cash],
      ['Accounts Receivable', balanceData.assets.accountsReceivable],
      ['Inventory', balanceData.assets.inventory],
      ['Prepaid Expenses', balanceData.assets.prepaidExpenses],
      ['Total Current Assets', calc.totalCurrentAssets],
      ['Property & Equipment', balanceData.assets.propertyEquipment],
      ['Other Assets', balanceData.assets.otherAssets],
      ['Total Assets', calc.totalAssets],
      [],
      ['Liabilities'],
      ['Accounts Payable', balanceData.liabilities.accountsPayable],
      ['Short-term Debt', balanceData.liabilities.shortTermDebt],
      ['Accrued Expenses', balanceData.liabilities.accruedExpenses],
      ['Long-term Debt', balanceData.liabilities.longTermDebt],
      ['Other Liabilities', balanceData.liabilities.otherLiabilities],
      ['Total Liabilities', calc.totalLiabilities],
      [],
      ['Equity'],
      ['Common Stock', balanceData.equity.commonStock],
      ['Retained Earnings', balanceData.equity.retainedEarnings],
      ['Additional Paid-in Capital', balanceData.equity.additionalPaidInCapital],
      ['Total Equity', calc.totalEquity],
    ]);
    XLSX.utils.book_append_sheet(workbook, balanceSheet, 'Balance Sheet');
  }

  if (cashFlowData) {
    const calc = calculateCashFlow(cashFlowData);
    const cashFlowSheet = XLSX.utils.aoa_to_sheet([
      ['Cash Flow Statement'],
      ['Company:', cashFlowData.companyName],
      ['Period:', cashFlowData.period],
      [],
      ['Operating Activities'],
      ['Net Income', cashFlowData.operating.netIncome],
      ['Depreciation', cashFlowData.operating.depreciation],
      ['Change in A/R', -cashFlowData.operating.accountsReceivableChange],
      ['Change in Inventory', -cashFlowData.operating.inventoryChange],
      ['Change in A/P', cashFlowData.operating.accountsPayableChange],
      ['Net Cash from Operations', calc.operatingCashFlow],
      [],
      ['Investing Activities'],
      ['Property Purchases', -cashFlowData.investing.propertyPurchases],
      ['Property Sales', cashFlowData.investing.propertySales],
      ['Net Cash from Investing', calc.investingCashFlow],
      [],
      ['Financing Activities'],
      ['Debt Issuance', cashFlowData.financing.debtIssuance],
      ['Debt Repayment', -cashFlowData.financing.debtRepayment],
      ['Net Cash from Financing', calc.financingCashFlow],
      [],
      ['Cash Summary'],
      ['Beginning Cash', cashFlowData.beginningCash],
      ['Net Change in Cash', calc.netCashChange],
      ['Ending Cash', calc.endingCash],
    ]);
    XLSX.utils.book_append_sheet(workbook, cashFlowSheet, 'Cash Flow');
  }

  if (summary) {
    const summarySheet = XLSX.utils.aoa_to_sheet([
      ['Financial Summary'],
      [],
      ['Key Metrics'],
      ['Total Income', summary.totalIncome],
      ['Total Expenses', summary.totalExpenses],
      ['Net Profit', summary.netProfit],
      ['Profit Margin', `${summary.profitMargin.toFixed(1)}%`],
      [],
      ['Income by Category'],
      ...Object.entries(summary.incomeByCategory).map(([cat, amt]) => [cat, amt]),
      [],
      ['Expenses by Category'],
      ...Object.entries(summary.expensesByCategory).map(([cat, amt]) => [cat, amt]),
      [],
      ['Monthly Data'],
      ['Month', 'Income', 'Expenses', 'Net Profit'],
      ...summary.monthlyData.map(m => [m.month, m.income, m.expenses, m.netProfit]),
    ]);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  }

  XLSX.writeFile(workbook, `financial-statements-${new Date().toISOString().split('T')[0]}.xlsx`);
}

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MetricCard } from './MetricCard';
import { StatementChart } from './StatementChart';
import { BalanceSheetData } from '@/types/financial';
import { calculateBalanceSheet, formatCurrency } from '@/lib/calculations';
import { Wallet, Scale, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

interface BalanceSheetOutputProps {
  data: BalanceSheetData;
}

export function BalanceSheetOutput({ data }: BalanceSheetOutputProps) {
  const calc = calculateBalanceSheet(data);

  const formattedDate = data.asOfDate 
    ? new Date(data.asOfDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'Date';

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Assets"
          value={formatCurrency(calc.totalAssets)}
          icon={<Wallet className="h-5 w-5" />}
          variant="accent"
        />
        <MetricCard
          label="Total Liabilities"
          value={formatCurrency(calc.totalLiabilities)}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="warning"
        />
        <MetricCard
          label="Total Equity"
          value={formatCurrency(calc.totalEquity)}
          icon={<Scale className="h-5 w-5" />}
          variant="success"
        />
        <MetricCard
          label="Current Ratio"
          value={calc.currentRatio.toFixed(2)}
          icon={calc.isBalanced ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          variant={calc.currentRatio >= 1 ? 'success' : 'warning'}
        />
      </div>

      {!calc.isBalanced && (
        <div className="rounded-lg bg-warning/10 border border-warning/20 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-warning" />
          <p className="text-sm text-warning">
            Balance sheet is not balanced. Assets ({formatCurrency(calc.totalAssets)}) ≠ Liabilities + Equity ({formatCurrency(calc.totalLiabilitiesAndEquity)})
          </p>
        </div>
      )}

      <Card className="shadow-elevated border-border bg-card overflow-hidden">
        <CardHeader className="gradient-primary text-primary-foreground px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">{data.companyName || 'Company Name'}</h2>
              <p className="text-primary-foreground/80 text-sm">Balance Sheet</p>
            </div>
            <p className="text-sm font-medium">As of {formattedDate}</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <tbody className="divide-y divide-border">
              <tr className="bg-accent/5">
                <td colSpan={2} className="px-6 py-3 font-display font-semibold text-foreground">Assets</td>
              </tr>
              <tr className="bg-secondary/30">
                <td colSpan={2} className="px-6 py-2 pl-8 font-medium text-muted-foreground">Current Assets</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-12 text-muted-foreground">Cash & Cash Equivalents</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.assets.cash)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-12 text-muted-foreground">Accounts Receivable</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.assets.accountsReceivable)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-12 text-muted-foreground">Inventory</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.assets.inventory)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-12 text-muted-foreground">Prepaid Expenses</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.assets.prepaidExpenses)}</td>
              </tr>
              <tr className="bg-secondary/50">
                <td className="px-6 py-2 pl-8 font-semibold">Total Current Assets</td>
                <td className="px-6 py-2 text-right font-bold">{formatCurrency(calc.totalCurrentAssets)}</td>
              </tr>

              <tr className="bg-secondary/30">
                <td colSpan={2} className="px-6 py-2 pl-8 font-medium text-muted-foreground">Non-Current Assets</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-12 text-muted-foreground">Property & Equipment</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.assets.propertyEquipment)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-12 text-muted-foreground">Other Assets</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.assets.otherAssets)}</td>
              </tr>
              <tr className="bg-secondary/50">
                <td className="px-6 py-2 pl-8 font-semibold">Total Non-Current Assets</td>
                <td className="px-6 py-2 text-right font-bold">{formatCurrency(calc.totalNonCurrentAssets)}</td>
              </tr>
              <tr className="bg-accent/10">
                <td className="px-6 py-3 font-display font-bold">Total Assets</td>
                <td className="px-6 py-3 text-right font-display font-bold text-accent">{formatCurrency(calc.totalAssets)}</td>
              </tr>

              <tr className="bg-accent/5">
                <td colSpan={2} className="px-6 py-3 font-display font-semibold text-foreground">Liabilities</td>
              </tr>
              <tr className="bg-secondary/30">
                <td colSpan={2} className="px-6 py-2 pl-8 font-medium text-muted-foreground">Current Liabilities</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-12 text-muted-foreground">Accounts Payable</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.liabilities.accountsPayable)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-12 text-muted-foreground">Short-Term Debt</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.liabilities.shortTermDebt)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-12 text-muted-foreground">Accrued Expenses</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.liabilities.accruedExpenses)}</td>
              </tr>
              <tr className="bg-secondary/50">
                <td className="px-6 py-2 pl-8 font-semibold">Total Current Liabilities</td>
                <td className="px-6 py-2 text-right font-bold">{formatCurrency(calc.totalCurrentLiabilities)}</td>
              </tr>

              <tr className="bg-secondary/30">
                <td colSpan={2} className="px-6 py-2 pl-8 font-medium text-muted-foreground">Long-Term Liabilities</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-12 text-muted-foreground">Long-Term Debt</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.liabilities.longTermDebt)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-12 text-muted-foreground">Other Liabilities</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.liabilities.otherLiabilities)}</td>
              </tr>
              <tr className="bg-secondary/50">
                <td className="px-6 py-2 pl-8 font-semibold">Total Long-Term Liabilities</td>
                <td className="px-6 py-2 text-right font-bold">{formatCurrency(calc.totalLongTermLiabilities)}</td>
              </tr>
              <tr className="bg-warning/10">
                <td className="px-6 py-3 font-display font-bold">Total Liabilities</td>
                <td className="px-6 py-3 text-right font-display font-bold text-warning">{formatCurrency(calc.totalLiabilities)}</td>
              </tr>

              <tr className="bg-accent/5">
                <td colSpan={2} className="px-6 py-3 font-display font-semibold text-foreground">Shareholders' Equity</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Common Stock</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.equity.commonStock)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Retained Earnings</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.equity.retainedEarnings)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Additional Paid-In Capital</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.equity.additionalPaidInCapital)}</td>
              </tr>
              <tr className="bg-success/10">
                <td className="px-6 py-3 font-display font-bold">Total Equity</td>
                <td className="px-6 py-3 text-right font-display font-bold text-success">{formatCurrency(calc.totalEquity)}</td>
              </tr>

              <tr className="bg-primary text-primary-foreground">
                <td className="px-6 py-4 font-display text-lg font-bold">Total Liabilities & Equity</td>
                <td className="px-6 py-4 text-right font-display text-lg font-bold">{formatCurrency(calc.totalLiabilitiesAndEquity)}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <StatementChart
        title="Assets Breakdown"
        barData={[
          { name: 'Cash', value: data.assets.cash },
          { name: 'Receivables', value: data.assets.accountsReceivable },
          { name: 'Inventory', value: data.assets.inventory },
          { name: 'Prepaid', value: data.assets.prepaidExpenses },
          { name: 'Property', value: data.assets.propertyEquipment },
          { name: 'Other', value: data.assets.otherAssets },
        ]}
        pieData={[
          { name: 'Cash', value: data.assets.cash },
          { name: 'Receivables', value: data.assets.accountsReceivable },
          { name: 'Inventory', value: data.assets.inventory },
          { name: 'Property', value: data.assets.propertyEquipment },
        ]}
      />

      <StatementChart
        title="Assets vs Liabilities vs Equity"
        barData={[
          { name: 'Assets', value: calc.totalAssets },
          { name: 'Liabilities', value: calc.totalLiabilities },
          { name: 'Equity', value: calc.totalEquity },
        ]}
      />
    </div>
  );
}

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MetricCard } from './MetricCard';
import { StatementChart } from './StatementChart';
import { CashFlowData } from '@/types/financial';
import { calculateCashFlow, formatCurrency } from '@/lib/calculations';
import { ArrowRightLeft, TrendingUp, TrendingDown, Banknote, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface CashFlowOutputProps {
  data: CashFlowData;
}

export function CashFlowOutput({ data }: CashFlowOutputProps) {
  const calc = calculateCashFlow(data);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Operating Cash"
          value={formatCurrency(calc.operatingCashFlow)}
          icon={<ArrowRightLeft className="h-5 w-5" />}
          variant={calc.operatingCashFlow >= 0 ? 'success' : 'warning'}
        />
        <MetricCard
          label="Investing Cash"
          value={formatCurrency(calc.investingCashFlow)}
          icon={<TrendingUp className="h-5 w-5" />}
          variant={calc.investingCashFlow >= 0 ? 'accent' : 'default'}
        />
        <MetricCard
          label="Financing Cash"
          value={formatCurrency(calc.financingCashFlow)}
          icon={<Banknote className="h-5 w-5" />}
          variant={calc.financingCashFlow >= 0 ? 'accent' : 'default'}
        />
        <MetricCard
          label="Ending Cash"
          value={formatCurrency(calc.endingCash)}
          icon={calc.netCashChange >= 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
          variant={calc.endingCash >= 0 ? 'success' : 'warning'}
        />
      </div>

      <Card className="shadow-elevated border-border bg-card overflow-hidden">
        <CardHeader className="gradient-primary text-primary-foreground px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">{data.companyName || 'Company Name'}</h2>
              <p className="text-primary-foreground/80 text-sm">Statement of Cash Flows</p>
            </div>
            <p className="text-sm font-medium">{data.period || 'Period'}</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <tbody className="divide-y divide-border">
              {/* Operating Activities */}
              <tr className="bg-accent/5">
                <td colSpan={2} className="px-6 py-3 font-display font-semibold text-foreground">
                  Operating Activities
                </td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Net Income</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.operating.netIncome)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Depreciation & Amortization</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.operating.depreciation)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Change in Accounts Receivable</td>
                <td className="px-6 py-2 text-right font-medium">
                  {data.operating.accountsReceivableChange >= 0 ? '(' : ''}
                  {formatCurrency(Math.abs(data.operating.accountsReceivableChange))}
                  {data.operating.accountsReceivableChange >= 0 ? ')' : ''}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Change in Inventory</td>
                <td className="px-6 py-2 text-right font-medium">
                  {data.operating.inventoryChange >= 0 ? '(' : ''}
                  {formatCurrency(Math.abs(data.operating.inventoryChange))}
                  {data.operating.inventoryChange >= 0 ? ')' : ''}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Change in Accounts Payable</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.operating.accountsPayableChange)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Other Operating Activities</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.operating.otherOperating)}</td>
              </tr>
              <tr className="bg-secondary/50">
                <td className="px-6 py-3 font-semibold">Net Cash from Operating</td>
                <td className={`px-6 py-3 text-right font-bold ${calc.operatingCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(calc.operatingCashFlow)}
                </td>
              </tr>

              {/* Investing Activities */}
              <tr className="bg-accent/5">
                <td colSpan={2} className="px-6 py-3 font-display font-semibold text-foreground">
                  Investing Activities
                </td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Property & Equipment Purchases</td>
                <td className="px-6 py-2 text-right font-medium text-destructive">({formatCurrency(data.investing.propertyPurchases)})</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Property & Equipment Sales</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.investing.propertySales)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Investment Purchases</td>
                <td className="px-6 py-2 text-right font-medium text-destructive">({formatCurrency(data.investing.investmentPurchases)})</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Investment Sales</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.investing.investmentSales)}</td>
              </tr>
              <tr className="bg-secondary/50">
                <td className="px-6 py-3 font-semibold">Net Cash from Investing</td>
                <td className={`px-6 py-3 text-right font-bold ${calc.investingCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(calc.investingCashFlow)}
                </td>
              </tr>

              {/* Financing Activities */}
              <tr className="bg-accent/5">
                <td colSpan={2} className="px-6 py-3 font-display font-semibold text-foreground">
                  Financing Activities
                </td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Debt Issuance</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.financing.debtIssuance)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Debt Repayment</td>
                <td className="px-6 py-2 text-right font-medium text-destructive">({formatCurrency(data.financing.debtRepayment)})</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Stock Issuance</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.financing.stockIssuance)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Dividends Paid</td>
                <td className="px-6 py-2 text-right font-medium text-destructive">({formatCurrency(data.financing.dividendsPaid)})</td>
              </tr>
              <tr className="bg-secondary/50">
                <td className="px-6 py-3 font-semibold">Net Cash from Financing</td>
                <td className={`px-6 py-3 text-right font-bold ${calc.financingCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(calc.financingCashFlow)}
                </td>
              </tr>

              {/* Summary */}
              <tr className="bg-accent/5">
                <td colSpan={2} className="px-6 py-3 font-display font-semibold text-foreground">
                  Cash Summary
                </td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Beginning Cash</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.beginningCash)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Net Change in Cash</td>
                <td className={`px-6 py-2 text-right font-medium ${calc.netCashChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(calc.netCashChange)}
                </td>
              </tr>
              <tr className="bg-primary text-primary-foreground">
                <td className="px-6 py-4 font-display text-lg font-bold">Ending Cash</td>
                <td className="px-6 py-4 text-right font-display text-lg font-bold">{formatCurrency(calc.endingCash)}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <StatementChart
        title="Cash Flow by Activity"
        barData={[
          { name: 'Operating', value: calc.operatingCashFlow },
          { name: 'Investing', value: calc.investingCashFlow },
          { name: 'Financing', value: calc.financingCashFlow },
        ]}
      />

      <StatementChart
        title="Cash Position"
        barData={[
          { name: 'Beginning', value: data.beginningCash },
          { name: 'Net Change', value: calc.netCashChange },
          { name: 'Ending', value: calc.endingCash },
        ]}
      />
    </div>
  );
}

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MetricCard } from './MetricCard';
import { StatementChart } from './StatementChart';
import { IncomeStatementData } from '@/types/financial';
import { calculateIncomeStatement, formatCurrency, formatPercentage } from '@/lib/calculations';
import { TrendingUp, DollarSign, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface IncomeStatementOutputProps {
  data: IncomeStatementData;
}

export function IncomeStatementOutput({ data }: IncomeStatementOutputProps) {
  const calc = calculateIncomeStatement(data);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Revenue"
          value={formatCurrency(calc.totalRevenue)}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="accent"
        />
        <MetricCard
          label="Gross Profit"
          value={formatCurrency(calc.grossProfit)}
          icon={<DollarSign className="h-5 w-5" />}
          variant="success"
        />
        <MetricCard
          label="Net Income"
          value={formatCurrency(calc.netIncome)}
          icon={calc.netIncome >= 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
          variant={calc.netIncome >= 0 ? 'success' : 'warning'}
        />
        <MetricCard
          label="Net Margin"
          value={formatPercentage(calc.netMargin)}
          icon={<Percent className="h-5 w-5" />}
          variant="default"
        />
      </div>

      <Card className="shadow-elevated border-border bg-card overflow-hidden">
        <CardHeader className="gradient-primary text-primary-foreground px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">{data.companyName || 'Company Name'}</h2>
              <p className="text-primary-foreground/80 text-sm">Income Statement</p>
            </div>
            <p className="text-sm font-medium">{data.period || 'Period'}</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <tbody className="divide-y divide-border">
              <tr className="bg-accent/5">
                <td colSpan={2} className="px-6 py-3 font-display font-semibold text-foreground">Revenue</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Sales Revenue</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.revenue.sales)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Service Revenue</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.revenue.service)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Other Revenue</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.revenue.other)}</td>
              </tr>
              <tr className="bg-secondary/50">
                <td className="px-6 py-3 font-semibold">Total Revenue</td>
                <td className="px-6 py-3 text-right font-bold text-accent">{formatCurrency(calc.totalRevenue)}</td>
              </tr>

              <tr className="bg-accent/5">
                <td colSpan={2} className="px-6 py-3 font-display font-semibold text-foreground">Cost of Goods Sold</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Cost of Goods Sold</td>
                <td className="px-6 py-2 text-right font-medium text-destructive">({formatCurrency(data.expenses.costOfGoodSold)})</td>
              </tr>
              <tr className="bg-secondary/50">
                <td className="px-6 py-3 font-semibold">Gross Profit</td>
                <td className="px-6 py-3 text-right font-bold text-success">{formatCurrency(calc.grossProfit)}</td>
              </tr>

              <tr className="bg-accent/5">
                <td colSpan={2} className="px-6 py-3 font-display font-semibold text-foreground">Operating Expenses</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Salaries & Wages</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.expenses.salaries)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Rent</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.expenses.rent)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Utilities</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.expenses.utilities)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Marketing</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.expenses.marketing)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Depreciation</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.expenses.depreciation)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Other Expenses</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.expenses.other)}</td>
              </tr>
              <tr className="bg-secondary/50">
                <td className="px-6 py-3 font-semibold">Total Operating Expenses</td>
                <td className="px-6 py-3 text-right font-bold text-destructive">({formatCurrency(calc.operatingExpenses)})</td>
              </tr>

              <tr className="bg-primary text-primary-foreground">
                <td className="px-6 py-4 font-display text-lg font-bold">Net Income</td>
                <td className="px-6 py-4 text-right font-display text-lg font-bold">{formatCurrency(calc.netIncome)}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <StatementChart
        title="Revenue Breakdown"
        barData={[
          { name: 'Sales', value: data.revenue.sales },
          { name: 'Services', value: data.revenue.service },
          { name: 'Other', value: data.revenue.other },
        ]}
        pieData={[
          { name: 'Sales', value: data.revenue.sales },
          { name: 'Services', value: data.revenue.service },
          { name: 'Other', value: data.revenue.other },
        ]}
      />

      <StatementChart
        title="Expense Breakdown"
        barData={[
          { name: 'COGS', value: data.expenses.costOfGoodSold },
          { name: 'Salaries', value: data.expenses.salaries },
          { name: 'Rent', value: data.expenses.rent },
          { name: 'Utilities', value: data.expenses.utilities },
          { name: 'Marketing', value: data.expenses.marketing },
          { name: 'Depreciation', value: data.expenses.depreciation },
          { name: 'Other', value: data.expenses.other },
        ]}
        pieData={[
          { name: 'COGS', value: data.expenses.costOfGoodSold },
          { name: 'Salaries', value: data.expenses.salaries },
          { name: 'Rent', value: data.expenses.rent },
          { name: 'Utilities', value: data.expenses.utilities },
          { name: 'Marketing', value: data.expenses.marketing },
          { name: 'Depreciation', value: data.expenses.depreciation },
          { name: 'Other', value: data.expenses.other },
        ]}
      />

      <StatementChart
        title="Profit Overview"
        barData={[
          { name: 'Revenue', value: calc.totalRevenue },
          { name: 'Gross Profit', value: calc.grossProfit },
          { name: 'Net Income', value: calc.netIncome },
        ]}
      />
    </div>
  );
}

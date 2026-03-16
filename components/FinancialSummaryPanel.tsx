"use client"
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MetricCard } from './MetricCard';
import { TransactionData, FinancialSummary } from '@/types/financial';
import { calculateFinancialSummary, formatCurrency, formatPercentage } from '@/lib/calculations';
import { DollarSign, TrendingUp, TrendingDown, Percent, PieChart } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

interface FinancialSummaryPanelProps {
  transactions: TransactionData[];
  companyName: string;
}

const COLORS = [
  'hsl(var(--accent))',
  'hsl(var(--primary))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
  'hsl(var(--success))',
  'hsl(215, 28%, 40%)',
  'hsl(160, 60%, 50%)',
  'hsl(38, 70%, 60%)',
];

export function FinancialSummaryPanel({ transactions, companyName }: FinancialSummaryPanelProps) {
  const summary = calculateFinancialSummary(transactions);

  const expensePieData = Object.entries(summary.expensesByCategory).map(([name, value], idx) => ({
    name,
    value: value as number,
    color: COLORS[idx % COLORS.length],
  }));

  const incomePieData = Object.entries(summary.incomeByCategory).map(([name, value], idx) => ({
    name,
    value: value as number,
    color: COLORS[idx % COLORS.length],
  }));

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 p-12 text-center">
        <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          No Transaction Data
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Upload a CSV or Excel file with your transactions, or enter data manually in other statement types.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Income"
          value={formatCurrency(summary.totalIncome)}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="accent"
        />
        <MetricCard
          label="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          icon={<TrendingDown className="h-5 w-5" />}
          variant="warning"
        />
        <MetricCard
          label="Net Profit"
          value={formatCurrency(summary.netProfit)}
          icon={<DollarSign className="h-5 w-5" />}
          variant={summary.netProfit >= 0 ? 'success' : 'warning'}
        />
        <MetricCard
          label="Profit Margin"
          value={formatPercentage(summary.profitMargin)}
          icon={<Percent className="h-5 w-5" />}
          variant="default"
        />
      </div>

      {/* Income vs Expense Trend */}
      {summary.monthlyData.length > 0 && (
        <Card className="border-border bg-card shadow-soft">
          <CardHeader>
            <h4 className="font-display font-semibold">Income vs Expenses Trend</h4>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                   formatter={(value) => formatCurrency(Number(value ?? 0))}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="hsl(var(--accent))" strokeWidth={2} name="Income" />
                  <Line type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" strokeWidth={2} name="Expenses" />
                  <Line type="monotone" dataKey="netProfit" stroke="hsl(var(--success))" strokeWidth={2} name="Net Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Net Profit Trend Bar Chart */}
      {summary.monthlyData.length > 0 && (
        <Card className="border-border bg-card shadow-soft">
          <CardHeader>
            <h4 className="font-display font-semibold">Monthly Net Profit</h4>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value ?? 0))}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="netProfit" 
                    name="Net Profit"
                    fill="hsl(var(--accent))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Breakdowns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Income by Category */}
        {incomePieData.length > 0 && (
          <Card className="border-border bg-card shadow-soft">
            <CardHeader>
              <h4 className="font-display font-semibold">Income by Category</h4>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={incomePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>   `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {incomePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                     formatter={(value) => formatCurrency(Number(value ?? 0))}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expenses by Category */}
        {expensePieData.length > 0 && (
          <Card className="border-border bg-card shadow-soft">
            <CardHeader>
              <h4 className="font-display font-semibold">Expenses by Category</h4>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={expensePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>   `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {expensePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value ?? 0))}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Table */}
      <Card className="shadow-elevated border-border bg-card overflow-hidden">
        <CardHeader className="gradient-primary text-primary-foreground px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">{companyName || 'Company Name'}</h2>
              <p className="text-primary-foreground/80 text-sm">Profit & Expense Summary</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <tbody className="divide-y divide-border">
              <tr className="bg-accent/5">
                <td colSpan={2} className="px-6 py-3 font-display font-semibold text-foreground">Income Summary</td>
              </tr>
              {Object.entries(summary.incomeByCategory).map(([category, amount]) => (
                <tr key={category}>
                  <td className="px-6 py-2 pl-10 text-muted-foreground">{category}</td>
                  <td className="px-6 py-2 text-right font-medium text-success">{formatCurrency(amount as number)}</td>
                </tr>
              ))}
              <tr className="bg-secondary/50">
                <td className="px-6 py-3 font-semibold">Total Income</td>
                <td className="px-6 py-3 text-right font-bold text-accent">{formatCurrency(summary.totalIncome)}</td>
              </tr>

              <tr className="bg-accent/5">
                <td colSpan={2} className="px-6 py-3 font-display font-semibold text-foreground">Expense Summary</td>
              </tr>
              {Object.entries(summary.expensesByCategory).map(([category, amount]) => (
                <tr key={category}>
                  <td className="px-6 py-2 pl-10 text-muted-foreground">{category}</td>
                  <td className="px-6 py-2 text-right font-medium text-destructive">({formatCurrency(amount as number)})</td>
                </tr>
              ))}
              <tr className="bg-secondary/50">
                <td className="px-6 py-3 font-semibold">Total Expenses</td>
                <td className="px-6 py-3 text-right font-bold text-destructive">({formatCurrency(summary.totalExpenses)})</td>
              </tr>

              <tr className="bg-primary text-primary-foreground">
                <td className="px-6 py-4 font-display text-lg font-bold">Net Profit</td>
                <td className="px-6 py-4 text-right font-display text-lg font-bold">{formatCurrency(summary.netProfit)}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

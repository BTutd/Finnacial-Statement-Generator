"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, TrendingUp, TrendingDown, DollarSign, CheckCircle } from 'lucide-react';
import { IncomeStatementData, BalanceSheetData, CashFlowData, TransactionData } from '@/types/financial';
import { calculateIncomeStatement, calculateFinancialSummary, formatCurrency, formatPercentage } from '@/lib/calculations';
import { supabase } from '@/integrations/supabase/client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from 'sonner';

interface ForecastPanelProps {
  incomeData?: IncomeStatementData;
  balanceData?: BalanceSheetData;
  cashFlowData?: CashFlowData;
  transactions?: TransactionData[];
}

interface ForecastResult {
  projections: {
    period: string;
    revenue: number;
    expenses: number;
    netProfit: number;
    growthRate: number;
  }[];
  analysis: {
    revenueOutlook: string;
    expenseOutlook: string;
    profitOutlook: string;
    overallTrend: 'positive' | 'neutral' | 'negative';
  };
  recommendations: string[];
}

export function ForecastPanel({ incomeData, balanceData, cashFlowData, transactions = [] }: ForecastPanelProps) {
 const [periods, setPeriods] = useState("6");
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<ForecastResult | null>(null);

  const incomeCalc = incomeData ? calculateIncomeStatement(incomeData) : null;
  const transactionSummary = transactions.length > 0 ? calculateFinancialSummary(transactions) : null;

  const currentRevenue = incomeCalc?.totalRevenue || transactionSummary?.totalIncome || 0;
  const currentExpenses = incomeCalc?.totalExpenses || transactionSummary?.totalExpenses || 0;
  const currentProfit = incomeCalc?.netIncome || transactionSummary?.netProfit || 0;

  const hasData = currentRevenue > 0 || currentExpenses > 0;

  const handleForecast = async () => {
    if (!hasData) {
      toast.error("No financial data available. Enter data or upload a file first.");
      return;
    }

    setLoading(true);
    setForecast(null);

    try {
      const { data: result, error } = await supabase.functions.invoke("predict-income", {
        body: {
          incomeData: incomeData || {
            companyName: "Company",
            period: "Current",
            revenue: {
              sales: transactionSummary?.totalIncome || 0,
              services: 0,
              other: 0,
            },
            expenses: {
              costOfGoodsSold: 0,
              salaries: transactionSummary?.expensesByCategory?.["Salaries"] || 0,
              rent: transactionSummary?.expensesByCategory?.["Rent"] || 0,
              utilities: transactionSummary?.expensesByCategory?.["Utilities"] || 0,
              marketing: transactionSummary?.expensesByCategory?.["Marketing"] || 0,
              depreciation: 0,
              other: transactionSummary?.totalExpenses || 0,
            },
          },
          periods: parseInt(periods),
          forecastType: "comprehensive",
        },
      });

      if (error) throw error;
      if (result.error) throw new Error(result.error);

      const transformedResult: ForecastResult = {
        projections: result.projections.map((p: any) => ({
          period: p.period,
          revenue: p.totalRevenue,
          expenses: p.totalRevenue - p.netIncome,
          netProfit: p.netIncome,
          growthRate: p.growthRate,
        })),
        analysis: {
          revenueOutlook: result.trendAnalysis?.revenueGrowth || "Stable",
          expenseOutlook: result.trendAnalysis?.expensePattern || "Controlled",
          profitOutlook: result.trendAnalysis?.profitabilityTrend || "Steady",
          overallTrend: result.trendAnalysis?.overallOutlook || "neutral",
        },
        recommendations: result.keyInsights || [],
      };

      setForecast(transformedResult);
      toast.success(`Forecast generated for ${periods} periods.`);
    } catch (err) {
      console.error("Forecast error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to generate forecast");
    } finally {
      setLoading(false);
    }
  };

  const fullChartData = forecast
    ? [
        { period: "Current", revenue: currentRevenue, expenses: currentExpenses, netProfit: currentProfit },
        ...forecast.projections,
      ]
    : [];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "positive":
        return <TrendingUp className="h-5 w-5 text-success" />;
      case "negative":
        return <TrendingDown className="h-5 w-5 text-destructive" />;
      default:
        return <DollarSign className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "positive":
        return "text-success";
      case "negative":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card shadow-soft">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h3 className="font-display text-lg font-semibold">AI Financial Forecast</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Generate AI-powered forecasts for revenue, expenses, and profit based on your financial data.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-secondary/30 p-3">
              <p className="text-xs text-muted-foreground">Current Revenue</p>
              <p className="text-lg font-semibold text-foreground">{formatCurrency(currentRevenue)}</p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-3">
              <p className="text-xs text-muted-foreground">Current Expenses</p>
              <p className="text-lg font-semibold text-foreground">{formatCurrency(currentExpenses)}</p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-3">
              <p className="text-xs text-muted-foreground">Current Net Profit</p>
              <p className={`text-lg font-semibold ${currentProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(currentProfit)}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">Forecast Periods</label>
              <Select value={periods} onValueChange={setPeriods}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Periods</SelectItem>
                  <SelectItem value="6">6 Periods</SelectItem>
                  <SelectItem value="12">12 Periods</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleForecast} disabled={loading || !hasData} variant="accent" className="min-w-32">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Forecasting...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Forecast
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {forecast && (
        <div className="space-y-6 animate-slide-up">
          {/* Revenue Forecast Chart */}
          <Card className="border-border bg-card shadow-soft">
            <CardHeader>
              <h4 className="font-display font-semibold">Revenue Forecast</h4>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fullChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="period" className="text-xs" />
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
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2} name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Expense Forecast Chart */}
          <Card className="border-border bg-card shadow-soft">
            <CardHeader>
              <h4 className="font-display font-semibold">Expense Forecast</h4>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fullChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="period" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value ?? 0))}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="expenses" fill="hsl(var(--warning))" name="Expenses" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Profit Forecast Chart */}
          <Card className="border-border bg-card shadow-soft">
            <CardHeader>
              <h4 className="font-display font-semibold">Profit Forecast</h4>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fullChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="period" className="text-xs" />
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
                    <Line type="monotone" dataKey="netProfit" stroke="hsl(var(--success))" strokeWidth={2} name="Net Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Analysis */}
          <Card className="border-border bg-card shadow-soft">
            <CardHeader className="flex-row items-center gap-3">
              {getTrendIcon(forecast.analysis.overallTrend)}
              <div>
                <h4 className="font-display font-semibold">Forecast Analysis</h4>
                <p className={`text-sm font-medium capitalize ${getTrendColor(forecast.analysis.overallTrend)}`}>
                  {forecast.analysis.overallTrend} Outlook
                </p>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Revenue Outlook</p>
                <p className="text-sm text-muted-foreground">{forecast.analysis.revenueOutlook}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Expense Outlook</p>
                <p className="text-sm text-muted-foreground">{forecast.analysis.expenseOutlook}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Profit Outlook</p>
                <p className="text-sm text-muted-foreground">{forecast.analysis.profitOutlook}</p>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {forecast.recommendations.length > 0 && (
            <Card className="border-border bg-card shadow-soft">
              <CardHeader>
                <h4 className="font-display font-semibold">Recommendations</h4>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {forecast.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Projections Table */}
          <Card className="border-border bg-card shadow-elevated overflow-hidden">
            <CardHeader className="gradient-primary text-primary-foreground">
              <h4 className="font-display font-semibold">Detailed Projections</h4>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold">Period</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Revenue</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Expenses</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Net Profit</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {forecast.projections.map((proj, idx) => (
                      <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{proj.period}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(proj.revenue)}</td>
                        <td className="px-4 py-3 text-right text-destructive">{formatCurrency(proj.expenses)}</td>
                        <td className={`px-4 py-3 text-right font-medium ${proj.netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {formatCurrency(proj.netProfit)}
                        </td>
                        <td className={`px-4 py-3 text-right ${proj.growthRate >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {proj.growthRate >= 0 ? '+' : ''}{formatPercentage(proj.growthRate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle } from "lucide-react";
import { IncomeStatementData } from "@/types/financial";
import { PredictionResponse } from "@/types/prediction";
import { formatCurrency, formatPercentage } from "@/lib/calculations";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

interface PredictionPanelProps {
  data: IncomeStatementData;
}

export function PredictionPanel({ data }: PredictionPanelProps) {
  const [periods, setPeriods] = useState("3");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

  const handlePredict = async () => {
    const totalRevenue = data.revenue.sales + data.revenue.service + data.revenue.other;

    if (totalRevenue === 0) {
      toast.error("Please enter some financial data before generating predictions.");
      return;
    }

    setLoading(true);
    setPrediction(null);

    try {
      const { data: result, error } = await supabase.functions.invoke("predict-income", {
        body: { incomeData: data, periods: parseInt(periods) },
      });

      if (error) throw error;
      if (result.error) throw new Error(result.error);

      setPrediction(result);
      toast.success(`Generated ${periods} period forecast with trend analysis.`);
    } catch (err) {
      console.error("Prediction error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to generate prediction");
    } finally {
      setLoading(false);
    }
  };

  const getOutlookIcon = (outlook: string) => {
    switch (outlook) {
      case "positive":
        return <TrendingUp className="h-5 w-5 text-success" />;
      case "negative":
        return <TrendingDown className="h-5 w-5 text-destructive" />;
      default:
        return <Minus className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getOutlookColor = (outlook: string) => {
    switch (outlook) {
      case "positive":
        return "text-success";
      case "negative":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const chartData = prediction?.projections.map((p) => ({
    name: p.period,
    revenue: p.totalRevenue,
    netIncome: p.netIncome,
    growth: p.growthRate,
  })) || [];

  const currentRevenue = data.revenue.sales + data.revenue.service + data.revenue.other;
  const currentExpenses = Object.values(data.expenses).reduce((a, b) => a + b, 0);
  const currentNetIncome = currentRevenue - currentExpenses;

  const fullChartData = [
    { name: data.period || "Current", revenue: currentRevenue, netIncome: currentNetIncome, growth: 0 },
    ...chartData,
  ];

  return (
    <div className="space-y-6">
      {/* Forecast Controls */}
      <Card className="border-border bg-card shadow-soft">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h3 className="font-display text-lg font-semibold">AI Financial Predictions</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Generate AI-powered forecasts and trend analysis based on your current financial data.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">Forecast Periods</label>
              <Select value={periods} onValueChange={setPeriods}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Period</SelectItem>
                  <SelectItem value="3">3 Periods</SelectItem>
                  <SelectItem value="6">6 Periods</SelectItem>
                  <SelectItem value="12">12 Periods</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handlePredict} disabled={loading} variant="accent" className="min-w-32">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
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

      {/* Prediction Output */}
      {prediction && (
        <div className="space-y-6 animate-slide-up">
          {/* Trend Chart */}
          <Card className="border-border bg-card shadow-soft">
            <CardHeader>
              <h4 className="font-display font-semibold">Revenue & Income Trend</h4>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fullChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value: any) => [formatCurrency(Number(value ?? 0)), ""]}
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2} name="Revenue" />
                    <Line type="monotone" dataKey="netIncome" stroke="hsl(var(--success))" strokeWidth={2} name="Net Income" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Trend Analysis */}
          <Card className="border-border bg-card shadow-soft">
            <CardHeader className="flex-row items-center gap-3">
              {getOutlookIcon(prediction.trendAnalysis.overallOutlook)}
              <div>
                <h4 className="font-display font-semibold">Trend Analysis</h4>
                <p className={`text-sm font-medium capitalize ${getOutlookColor(prediction.trendAnalysis.overallOutlook)}`}>
                  {prediction.trendAnalysis.overallOutlook} Outlook
                </p>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Revenue Growth</p>
                <p className="text-sm text-muted-foreground">{prediction.trendAnalysis.revenueGrowth}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Profitability Trend</p>
                <p className="text-sm text-muted-foreground">{prediction.trendAnalysis.profitabilityTrend}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Expense Pattern</p>
                <p className="text-sm text-muted-foreground">{prediction.trendAnalysis.expensePattern}</p>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card className="border-border bg-card shadow-soft">
            <CardHeader>
              <h4 className="font-display font-semibold">Key Insights</h4>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {prediction.keyInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Projection Table */}
          <Card className="border-border bg-card shadow-elevated overflow-hidden">
            <CardHeader className="gradient-primary text-primary-foreground">
              <h4 className="font-display font-semibold">Projected Income Statements</h4>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold">Period</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Revenue</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Net Income</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Growth Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {prediction.projections.map((proj, idx) => (
                      <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{proj.period}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(proj.totalRevenue)}</td>
                        <td className={`px-4 py-3 text-right font-medium ${proj.netIncome >= 0 ? "text-success" : "text-destructive"}`}>
                          {formatCurrency(proj.netIncome)}
                        </td>
                        <td className={`px-4 py-3 text-right ${proj.growthRate >= 0 ? "text-success" : "text-destructive"}`}>
                          {proj.growthRate >= 0 ? "+" : ""}{formatPercentage(proj.growthRate)}
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
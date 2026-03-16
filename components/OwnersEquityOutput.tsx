import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MetricCard } from './MetricCard';
import { StatementChart } from './StatementChart';
import { OwnersEquityData } from '@/types/financial';
import { calculateOwnersEquity, formatCurrency, formatPercentage } from '@/lib/calculations';
import { PiggyBank, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface OwnersEquityOutputProps {
  data: OwnersEquityData;
}

export function OwnersEquityOutput({ data }: OwnersEquityOutputProps) {
  const calc = calculateOwnersEquity(data);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Beginning Capital"
          value={formatCurrency(data.beginningCapital)}
          icon={<PiggyBank className="h-5 w-5" />}
          variant="default"
        />
        <MetricCard
          label="Total Additions"
          value={formatCurrency(calc.totalAdditions)}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="success"
        />
        <MetricCard
          label="Total Deductions"
          value={formatCurrency(calc.totalDeductions)}
          icon={<TrendingDown className="h-5 w-5" />}
          variant="warning"
        />
        <MetricCard
          label="Ending Capital"
          value={formatCurrency(calc.endingCapital)}
          icon={<Wallet className="h-5 w-5" />}
          variant="accent"
        />
      </div>

      <Card className="shadow-elevated border-border bg-card overflow-hidden">
        <CardHeader className="gradient-primary text-primary-foreground px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">{data.companyName || 'Company Name'}</h2>
              <p className="text-primary-foreground/80 text-sm">Statement of Owner's Equity</p>
            </div>
            <p className="text-sm font-medium">{data.period || 'Period'}</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <tbody className="divide-y divide-border">
              <tr className="bg-accent/5">
                <td colSpan={2} className="px-6 py-3 font-display font-semibold text-foreground">Beginning Capital</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Owner's Capital, Beginning</td>
                <td className="px-6 py-2 text-right font-medium">{formatCurrency(data.beginningCapital)}</td>
              </tr>

              <tr className="bg-accent/5">
                <td colSpan={2} className="px-6 py-3 font-display font-semibold text-foreground">Add: Increases</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Owner's Investment</td>
                <td className="px-6 py-2 text-right font-medium text-success">{formatCurrency(data.ownersInvestment)}</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Net Income</td>
                <td className="px-6 py-2 text-right font-medium text-success">{formatCurrency(data.netIncome)}</td>
              </tr>
              <tr className="bg-secondary/50">
                <td className="px-6 py-3 font-semibold">Total Additions</td>
                <td className="px-6 py-3 text-right font-bold text-success">{formatCurrency(calc.totalAdditions)}</td>
              </tr>

              <tr className="bg-accent/5">
                <td colSpan={2} className="px-6 py-3 font-display font-semibold text-foreground">Less: Decreases</td>
              </tr>
              <tr>
                <td className="px-6 py-2 pl-10 text-muted-foreground">Owner's Drawings</td>
                <td className="px-6 py-2 text-right font-medium text-destructive">({formatCurrency(data.ownersDrawings)})</td>
              </tr>
              <tr className="bg-secondary/50">
                <td className="px-6 py-3 font-semibold">Total Deductions</td>
                <td className="px-6 py-3 text-right font-bold text-destructive">({formatCurrency(calc.totalDeductions)})</td>
              </tr>

              <tr className="bg-primary text-primary-foreground">
                <td className="px-6 py-4 font-display text-lg font-bold">Owner's Capital, Ending</td>
                <td className="px-6 py-4 text-right font-display text-lg font-bold">{formatCurrency(calc.endingCapital)}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <StatementChart
        title="Capital Changes"
        barData={[
          { name: 'Beginning Capital', value: data.beginningCapital },
          { name: 'Investment', value: data.ownersInvestment },
          { name: 'Net Income', value: data.netIncome },
          { name: 'Drawings', value: -data.ownersDrawings },
          { name: 'Ending Capital', value: calc.endingCapital },
        ]}
      />

      <StatementChart
        title="Capital Composition"
        pieData={[
          { name: 'Beginning Capital', value: data.beginningCapital },
          { name: "Owner's Investment", value: data.ownersInvestment },
          { name: 'Net Income', value: data.netIncome },
        ]}
      />
    </div>
  );
}

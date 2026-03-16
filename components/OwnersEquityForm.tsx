import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormSection } from './FormSection';
import { CurrencyInput } from './CurrencyInput';
import { OwnersEquityData } from '@/types/financial';
import { Building, PiggyBank, TrendingUp, TrendingDown } from 'lucide-react';

interface OwnersEquityFormProps {
  data: OwnersEquityData;
  onChange: (data: OwnersEquityData) => void;
}

export function OwnersEquityForm({ data, onChange }: OwnersEquityFormProps) {
  return (
    <Card className="shadow-elevated border-border bg-card">
      <CardContent className="p-6 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Building className="h-4 w-4 text-accent" />
            <h3 className="font-display font-semibold text-foreground">Company Information</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyNameOe">Company Name</Label>
              <Input
                id="companyNameOe"
                value={data.companyName}
                onChange={(e) => onChange({ ...data, companyName: e.target.value })}
                placeholder="Enter company name"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="periodOe">Period</Label>
              <Input
                id="periodOe"
                value={data.period}
                onChange={(e) => onChange({ ...data, period: e.target.value })}
                placeholder="e.g., FY 2024"
                className="bg-background"
              />
            </div>
          </div>
        </div>

        <FormSection title="Capital Account" icon={<PiggyBank className="h-4 w-4" />}>
          <CurrencyInput
            id="beginningCapital"
            label="Beginning Capital"
            value={data.beginningCapital}
            onChange={(v) => onChange({ ...data, beginningCapital: v })}
          />
        </FormSection>

        <FormSection title="Additions" icon={<TrendingUp className="h-4 w-4" />}>
          <CurrencyInput
            id="ownersInvestment"
            label="Owner's Investment"
            value={data.ownersInvestment}
            onChange={(v) => onChange({ ...data, ownersInvestment: v })}
          />
          <CurrencyInput
            id="netIncome"
            label="Net Income"
            value={data.netIncome}
            onChange={(v) => onChange({ ...data, netIncome: v })}
          />
        </FormSection>

        <FormSection title="Deductions" icon={<TrendingDown className="h-4 w-4" />}>
          <CurrencyInput
            id="ownersDrawings"
            label="Owner's Drawings"
            value={data.ownersDrawings}
            onChange={(v) => onChange({ ...data, ownersDrawings: v })}
          />
        </FormSection>
      </CardContent>
    </Card>
  );
}

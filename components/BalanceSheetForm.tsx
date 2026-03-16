
import { BalanceSheetData } from "@/types/financial";
import { Card, CardContent } from "./ui/card";
import { Building, CreditCard, PiggyBank, Wallet } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { FormSection } from "./FormSection";
import { CurrencyInput } from "./CurrencyInput";

interface BalanceSheetFormProps {
  data: BalanceSheetData;
  onChange: (data: BalanceSheetData) => void;
}

export function BalanceSheetForm({ data, onChange }: BalanceSheetFormProps) {
  const updateAssets = (
    field: keyof BalanceSheetData["assets"],
    value: number,
  ) => {
    onChange({ ...data, assets: { ...data.assets, [field]: value } });
  };
  const updateLiabilities = (
    field: keyof BalanceSheetData["liabilities"],
    value: number,
  ) => {
    onChange({ ...data, liabilities: { ...data.liabilities, [field]: value } });
  };
  const updateEquity = (
    field: keyof BalanceSheetData["equity"],
    value: number,
  ) => {
    onChange({ ...data, equity: { ...data.equity, [field]: value } });
  };
  return (
    <Card className="shadow-elevated border-border bg-card">
      <CardContent className="p-6 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Building className="h-4 w-4 text-accent" />
            <h3 className="font-display font-semibold text-foreground">
              Company Information
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={data.companyName}
                onChange={(e) =>
                  onChange({ ...data, companyName: e.target.value })
                }
                placeholder="Enter company name"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="asOfDate">As of Date</Label>
                <Input 
                id="asOfDate"
                value={data.asOfDate}
                onChange={(e)=>
                    onChange({...data,asOfDate:e.target.value})
                }
                className="bg-background"/>
            </div>
          </div>
        </div>
        <FormSection title="Assets" icon={<Wallet className="h-4 w-4" />}>
          <CurrencyInput
            id="cash"
            label="Cash & Cash Equivalents"
            value={data.assets.cash}
            onChange={(v) => updateAssets('cash', v)}
          />
          <CurrencyInput
            id="accountsReceivable"
            label="Accounts Receivable"
            value={data.assets.accountsReceivable}
            onChange={(v) => updateAssets('accountsReceivable', v)}
          />
          <CurrencyInput
            id="inventory"
            label="Inventory"
            value={data.assets.inventory}
            onChange={(v) => updateAssets('inventory', v)}
          />
          <CurrencyInput
            id="prepaidExpenses"
            label="Prepaid Expenses"
            value={data.assets.prepaidExpenses}
            onChange={(v) => updateAssets('prepaidExpenses', v)}
          />
          <CurrencyInput
            id="propertyEquipment"
            label="Property & Equipment"
            value={data.assets.propertyEquipment}
            onChange={(v) => updateAssets('propertyEquipment', v)}
          />
          <CurrencyInput
            id="otherAssets"
            label="Other Assets"
            value={data.assets.otherAssets}
            onChange={(v) => updateAssets('otherAssets', v)}
          />
        </FormSection>

        <FormSection title="Liabilities" icon={<CreditCard className="h-4 w-4" />}>
          <CurrencyInput
            id="accountsPayable"
            label="Accounts Payable"
            value={data.liabilities.accountsPayable}
            onChange={(v) => updateLiabilities('accountsPayable', v)}
          />
          <CurrencyInput
            id="shortTermDebt"
            label="Short-Term Debt"
            value={data.liabilities.shortTermDebt}
            onChange={(v) => updateLiabilities('shortTermDebt', v)}
          />
          <CurrencyInput
            id="accruedExpenses"
            label="Accrued Expenses"
            value={data.liabilities.accruedExpenses}
            onChange={(v) => updateLiabilities('accruedExpenses', v)}
          />
          <CurrencyInput
            id="longTermDebt"
            label="Long-Term Debt"
            value={data.liabilities.longTermDebt}
            onChange={(v) => updateLiabilities('longTermDebt', v)}
          />
          <CurrencyInput
            id="otherLiabilities"
            label="Other Liabilities"
            value={data.liabilities.otherLiabilities}
            onChange={(v) => updateLiabilities('otherLiabilities', v)}
          />
        </FormSection>

        <FormSection title="Shareholders' Equity" icon={<PiggyBank className="h-4 w-4" />}>
          <CurrencyInput
            id="commonStock"
            label="Common Stock"
            value={data.equity.commonStock}
            onChange={(v) => updateEquity('commonStock', v)}
          />
          <CurrencyInput
            id="retainedEarnings"
            label="Retained Earnings"
            value={data.equity.retainedEarnings}
            onChange={(v) => updateEquity('retainedEarnings', v)}
          />
          <CurrencyInput
            id="additionalPaidInCapital"
            label="Additional Paid-In Capital"
            value={data.equity.additionalPaidInCapital}
            onChange={(v) => updateEquity('additionalPaidInCapital', v)}
          />
          <CurrencyInput
            id="ownersInvestment"
            label="Owner's Investment"
            value={data.equity.ownersInvestment}
            onChange={(v) => updateEquity('ownersInvestment', v)}
          />
          <CurrencyInput
            id="ownersDrawings"
            label="Owner's Drawings"
            value={data.equity.ownersDrawings}
            onChange={(v) => updateEquity('ownersDrawings', v)}
          />
        </FormSection>
      </CardContent>
    </Card>
  );
}

"use client";

import { CashFlowData } from "@/types/financial";
import { Card, CardContent } from "./ui/card";
import { FormSection } from "./FormSection";
import { CurrencyInput } from "./CurrencyInput";
import { ArrowRightLeft, Banknote, Building, TrendingUp } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface CashFlowFormProps {
  data: CashFlowData;
  onChange: (data: CashFlowData) => void;
}
export function CashFlowForm({ data, onChange }: CashFlowFormProps) {
  const updateOperating = (
    field: keyof CashFlowData["operating"],
    value: number,
  ) => {
    onChange({ ...data, operating: { ...data.operating, [field]: value } });
  };
  const updateInvesting = (
    feild: keyof CashFlowData["investing"],
    value: number,
  ) => {
    onChange({...data, investing: {...data.investing, [feild]: value}});
  };
  const updateFinancing = (
    feild: keyof CashFlowData["financing"],
    value: number,
  ) => {
    onChange({...data, financing: {...data.financing, [feild]: value}});
  };
  
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
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={data.companyName}
                onChange={(e) => onChange({ ...data, companyName: e.target.value })}
                placeholder="Enter company name"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Reporting Period</Label>
              <Input
                id="period"
                value={data.period}
                onChange={(e) => onChange({ ...data, period: e.target.value })}
                placeholder="e.g., Q4 2024"
                className="bg-background"
              />
            </div>
          </div>
          <CurrencyInput
            id="beginningCash"
            label="Beginning Cash Balance"
            value={data.beginningCash}
            onChange={(v) => onChange({ ...data, beginningCash: v })}
          />
        </div>

        <FormSection title="Operating Activities" icon={<ArrowRightLeft className="h-4 w-4" />}>
          <CurrencyInput
            id="netIncome"
            label="Net Income"
            value={data.operating.netIncome}
            onChange={(v) => updateOperating('netIncome', v)}
          />
          <CurrencyInput
            id="depreciation"
            label="Depreciation & Amortization"
            value={data.operating.depreciation}
            onChange={(v) => updateOperating('depreciation', v)}
          />
          <CurrencyInput
            id="arChange"
            label="Change in Accounts Receivable"
            value={data.operating.accountsReceivableChange}
            onChange={(v) => updateOperating('accountsReceivableChange', v)}
          />
          <CurrencyInput
            id="inventoryChange"
            label="Change in Inventory"
            value={data.operating.inventoryChange}
            onChange={(v) => updateOperating('inventoryChange', v)}
          />
          <CurrencyInput
            id="apChange"
            label="Change in Accounts Payable"
            value={data.operating.accountsPayableChange}
            onChange={(v) => updateOperating('accountsPayableChange', v)}
          />
          <CurrencyInput
            id="otherOperating"
            label="Other Operating Activities"
            value={data.operating.otherOperating}
            onChange={(v) => updateOperating('otherOperating', v)}
          />
        </FormSection>

        <FormSection title="Investing Activities" icon={<TrendingUp className="h-4 w-4" />}>
          <CurrencyInput
            id="propertyPurchases"
            label="Property & Equipment Purchases"
            value={data.investing.propertyPurchases}
            onChange={(v) => updateInvesting('propertyPurchases', v)}
          />
          <CurrencyInput
            id="propertySales"
            label="Property & Equipment Sales"
            value={data.investing.propertySales}
            onChange={(v) => updateInvesting('propertySales', v)}
          />
          <CurrencyInput
            id="investmentPurchases"
            label="Investment Purchases"
            value={data.investing.investmentPurchases}
            onChange={(v) => updateInvesting('investmentPurchases', v)}
          />
          <CurrencyInput
            id="investmentSales"
            label="Investment Sales"
            value={data.investing.investmentSales}
            onChange={(v) => updateInvesting('investmentSales', v)}
          />
          <CurrencyInput
            id="otherInvesting"
            label="Other Investing Activities"
            value={data.investing.otherInvesting}
            onChange={(v) => updateInvesting('otherInvesting', v)}
          />
        </FormSection>

        <FormSection title="Financing Activities" icon={<Banknote className="h-4 w-4" />}>
          <CurrencyInput
            id="debtIssuance"
            label="Debt Issuance (Borrowings)"
            value={data.financing.debtIssuance}
            onChange={(v) => updateFinancing('debtIssuance', v)}
          />
          <CurrencyInput
            id="debtRepayment"
            label="Debt Repayment"
            value={data.financing.debtRepayment}
            onChange={(v) => updateFinancing('debtRepayment', v)}
          />
          <CurrencyInput
            id="stockIssuance"
            label="Stock Issuance"
            value={data.financing.stockIssuance}
            onChange={(v) => updateFinancing('stockIssuance', v)}
          />
          <CurrencyInput
            id="dividendsPaid"
            label="Dividends Paid"
            value={data.financing.dividendsPaid}
            onChange={(v) => updateFinancing('dividendsPaid', v)}
          />
          <CurrencyInput
            id="otherFinancing"
            label="Other Financing Activities"
            value={data.financing.otherFinancing}
            onChange={(v) => updateFinancing('otherFinancing', v)}
          />
        </FormSection>
      </CardContent>
    </Card>
  );
}

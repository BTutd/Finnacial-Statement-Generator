"use client";

import { IncomeStatementData } from "@/types/financial";
import { Card, CardContent } from "./ui/card";
import { Building, TrendingDown, TrendingUp } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { FormSection } from "./FormSection";
import { CurrencyInput } from "./CurrencyInput";

interface IncomeStatementFormProps {
  data: IncomeStatementData;
  onChange: (data: IncomeStatementData) => void;
}

export function IncomeStatementForm({
  data,
  onChange,
}: IncomeStatementFormProps) {
  const updateRevenue = (
    field: keyof IncomeStatementData["revenue"],
    value: number,
  ) => {
    onChange({ ...data, revenue: { ...data.revenue, [field]: value } });
  };
  const updateExpenses = (
    field: keyof IncomeStatementData["expenses"],
    value: number,
  ) => {
    onChange({ ...data, expenses: { ...data.expenses, [field]: value } });
  };
  return (
    <Card className="shadow-elevated border-border bg-card">
      <CardContent className="p-6 space-y-8">
        <div className="space-y-4">
          <div className=" flex items-center gap-2  pb-2  border-b border-border">
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
              <Label htmlFor="period">Reporting period</Label>
              <Input
                id="period"
                value={data.period}
                onChange={(e) => onChange({ ...data, period: e.target.value })}
                placeholder="eg., Q4 2026"
                className="bg-background"
              />
            </div>
          </div>
        </div>
        <FormSection title="Revenue" icon={<TrendingUp className="h-4 w-4" />}>
          <CurrencyInput
            id="sales"
            label="Sales Revenue"
            value={data.revenue.sales}
            onChange={(v) => updateRevenue("sales", v)}
          ></CurrencyInput>
          <CurrencyInput
            id="service"
            label="Service Revenue"
            value={data.revenue.service}
            onChange={(v) => updateRevenue("service", v)}
          ></CurrencyInput>
          <CurrencyInput
            id="other"
            label="Other Revenue"
            value={data.revenue.other}
            onChange={(v) => updateRevenue("other", v)}
          ></CurrencyInput>
        </FormSection>
        <FormSection
          title="Expenses"
          icon={<TrendingDown className="h-4 w-4" />}
        >
          <CurrencyInput
            id="cogs"
            label="Cost Of Good Sold"
            value={data.expenses.costOfGoodSold}
            onChange={(v) => updateExpenses("costOfGoodSold", v)}
          ></CurrencyInput>
          <CurrencyInput
            id="salaries"
            label="Salaries & Wages"
            value={data.expenses.salaries}
            onChange={(v) => updateExpenses("salaries", v)}
          ></CurrencyInput>
          <CurrencyInput
            id="rent"
            label="Rent"
            value={data.expenses.rent}
            onChange={(v) => updateExpenses("rent", v)}
          ></CurrencyInput>
          <CurrencyInput
            id="utilities"
            label="Utilities"
            value={data.expenses.utilities}
            onChange={(v) => updateExpenses("utilities", v)}
          ></CurrencyInput>
          <CurrencyInput
            id="marketing"
            label="Marketing"
            value={data.expenses.marketing}
            onChange={(v) => updateExpenses("marketing", v)}
          ></CurrencyInput>
          <CurrencyInput
            id="depreciation"
            label="Depreciation"
            value={data.expenses.depreciation}
            onChange={(v) => updateExpenses("depreciation", v)}
          ></CurrencyInput>
          <CurrencyInput
            id="other"
            label="Other Expenses"
            value={data.expenses.other}
            onChange={(v) => updateExpenses("other", v)}
          ></CurrencyInput>
        </FormSection>
      </CardContent>
    </Card>
  );
}

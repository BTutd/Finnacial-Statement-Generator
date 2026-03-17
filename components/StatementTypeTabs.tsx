"use client";

import { StatementType } from "@/types/financial";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp, FileText, Landmark, PieChart, Scale } from "lucide-react";


interface StatementTypeTabsProps {
  value: StatementType;
  onChange: (type: StatementType) => void;
}
export default function StatementTypeTabs({
  value,
  onChange,
}: StatementTypeTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as StatementType)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-5 my-2 h-auto  bg-secondary">
        <TabsTrigger
          value="income"
          className="flex items-center gap-2 py-2 data-[state=active]:bg-card data-[state=active]:shadow-soft"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Income Statement</span>
          <span className="sm:hidden">Income</span>
        </TabsTrigger>
        <TabsTrigger
          value="balance"
          className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-soft"
        >
          <Scale className="h-4 w-4" />
          <span className="hidden sm:inline">Balance Sheet</span>
          <span className="sm:hidden">Balance</span>
        </TabsTrigger>
        <TabsTrigger
          value="cashflow"
          className="flex items-center gap-2 py-3 data-[state=active]:bg-card data-[state=active]:shadow-soft"
        >
          <ArrowDownUp className="h-4 w-4" />
          <span className="hidden sm:inline">Cash Flow</span>
          <span className="sm:hidden">Cash</span>
        </TabsTrigger>
        <TabsTrigger
          value="equity"
          className="flex items-center gap-2 py-3 data-[state=active]:bg-card data-[state=active]:shadow-soft"
        >
          <Landmark className="h-4 w-4" />
          <span className="hidden sm:inline">Owner's Equity</span>
          <span className="sm:hidden">Equity</span>
        </TabsTrigger>
         <TabsTrigger
          value="summary"
          className="flex items-center gap-2 py-3 data-[state=active]:bg-card data-[state=active]:shadow-soft"
        >
          <PieChart className="h-4 w-4" />
          <span className="hidden sm:inline">Summary</span>
          <span className="sm:hidden">Summary</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileText,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react";
import {
  IncomeStatementData,
  BalanceSheetData,
  CashFlowData,
  TransactionData,
  StatementType,
} from "@/types/financial";
import {
  exportIncomeStatementPDF,
  exportBalanceSheetPDF,
  exportCashFlowPDF,
  exportSummaryPDF,
  exportToExcel,
} from "@/lib/exportUtils";
import { calculateFinancialSummary } from "@/lib/calculations";
import { toast } from "sonner";

interface ExportPanelProps {
  statementType: StatementType;
  incomeData?: IncomeStatementData;
  balanceData?: BalanceSheetData;
  cashFlowData?: CashFlowData;
  transactions?: TransactionData[];
  companyName?: string;
}

export function ExportPanel({
  statementType,
  incomeData,
  balanceData,
  cashFlowData,
  transactions = [],
  companyName = "Company",
}: ExportPanelProps) {
  const handleExportPDF = () => {
    try {
      switch (statementType) {
        case "income":
          if (incomeData) {
            exportIncomeStatementPDF(incomeData);
            toast.success("Income Statement PDF downloaded");
          }
          break;
        case "balance":
          if (balanceData) {
            exportBalanceSheetPDF(balanceData);
            toast.success("Balance Sheet PDF downloaded");
          }
          break;
        case "cashflow":
          if (cashFlowData) {
            exportCashFlowPDF(cashFlowData);
            toast.success("Cash Flow Statement PDF downloaded");
          }
          break;
        case "summary":
          if (transactions.length > 0) {
            const summary = calculateFinancialSummary(transactions);
            exportSummaryPDF(summary, companyName);
            toast.success("Financial Summary PDF downloaded");
          } else {
            toast.error("Upload data first to export");
          }
          break;
      }
    } catch {
      toast.error("Failed to generate PDF");
    }
  };

  const handleExportExcel = () => {
    try {
      const summary =
        transactions.length > 0
          ? calculateFinancialSummary(transactions)
          : undefined;
      exportToExcel(incomeData, balanceData, cashFlowData, summary);
      toast.success("Spreadsheet downloaded");
    } catch {
      toast.error("Failed to generate Excel file");
    }
  };

  const handleExportAll = () => {
    handleExportPDF();
    setTimeout(() => handleExportExcel(), 500);
  };

  return (
    <Card className="border-border bg-card shadow-soft">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-accent" />
          <h3 className="font-display text-lg font-semibold">Export Reports</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleExportPDF} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={handleExportExcel} variant="outline" size="sm">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="accent" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export All
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportAll}>
                Download All Formats
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>
                Current Statement (PDF)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportExcel}>
                All Statements (Excel)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
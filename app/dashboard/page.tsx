"use client";
import { Metadata } from "next";
import Header from "@/components/Header";
import StatementTypeTabs from "@/components/StatementTypeTabs";
import {
  BalanceSheetData,
  CashFlowData,
  IncomeStatementData,
  OwnersEquityData,
  StatementType,
  TransactionData,
} from "@/types/financial";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IncomeStatementForm } from "@/components/IncomeStatementForm";
import { BalanceSheetForm } from "@/components/BalanceSheetForm";
import { CashFlowForm } from "@/components/CashFlowForm";
import { OwnersEquityForm } from "@/components/OwnersEquityForm";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Printer,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Upload,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialSummaryPanel } from "@/components/FinancialSummaryPanel";
import { ExportPanel } from "@/components/ExportPanel";
import { IncomeStatementOutput } from "@/components/IncomeStatementOutput";
import { BalanceSheetOutput } from "@/components/BalanceSheetOutput";
import { OwnersEquityOutput } from "@/components/OwnersEquityOutput";
import { CashFlowOutput } from "@/components/CashFlowOutput";
import { ParsedFileData } from "@/lib/fileParser";
import { PredictionPanel } from "@/components/PredictionPanel";
import { ForecastPanel } from "@/components/ForecastPanel";
import { FileUpload } from "@/components/FileUpload";

const defaultIncomeData: IncomeStatementData = {
  companyName: "",
  period: "",
  revenue: { sales: 0, service: 0, other: 0 },
  expenses: {
    costOfGoodSold: 0,
    salaries: 0,
    rent: 0,
    utilities: 0,
    marketing: 0,
    depreciation: 0,
    other: 0,
  },
};
const defaultBalanceData: BalanceSheetData = {
  companyName: "",
  asOfDate: "",
  assets: {
    cash: 0,
    accountsReceivable: 0,
    inventory: 0,
    prepaidExpenses: 0,
    propertyEquipment: 0,
    otherAssets: 0,
  },
  liabilities: {
    accountsPayable: 0,
    shortTermDebt: 0,
    accruedExpenses: 0,
    longTermDebt: 0,
    otherLiabilities: 0,
  },
  equity: {
    commonStock: 0,
    retainedEarnings: 0,
    additionalPaidInCapital: 0,
    ownersInvestment: 0,
    ownersDrawings: 0,
  },
};
const defaultCashFlowData: CashFlowData = {
  companyName: "",
  period: "",
  operating: {
    netIncome: 0,
    depreciation: 0,
    accountsReceivableChange: 0,
    inventoryChange: 0,
    accountsPayableChange: 0,
    otherOperating: 0,
  },
  investing: {
    propertyPurchases: 0,
    propertySales: 0,
    investmentPurchases: 0,
    investmentSales: 0,
    otherInvesting: 0,
  },
  financing: {
    debtIssuance: 0,
    debtRepayment: 0,
    stockIssuance: 0,
    dividendsPaid: 0,
    otherFinancing: 0,
  },
  beginningCash: 0,
};
const defaultOwnersEquityData: OwnersEquityData = {
  companyName: "",
  period: "",
  beginningCapital: 0,
  ownersInvestment: 0,
  netIncome: 0,
  ownersDrawings: 0,
};
export default function Dashboard() {
  // const router = useRouter()
  const [statementType, setStatementType] = useState<StatementType>("income");
  const [incomeData, setIncomeData] =
    useState<IncomeStatementData>(defaultIncomeData);
  const [balanceData, setBalanceData] =
    useState<BalanceSheetData>(defaultBalanceData);
  const [cashFlowData, setCashFlowData] =
    useState<CashFlowData>(defaultCashFlowData);
  const [equityData, setEquityData] = useState<OwnersEquityData>(
    defaultOwnersEquityData,
  );
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [showOutput, setShowOutput] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Prevent back button navigation to callback/landing
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Prevent the back navigation and reload the dashboard instead
      window.location.reload();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const handleGenerate = () => {
    setShowOutput(true);
  };

  const handleReset = () => {
    if (statementType === "income") {
      setIncomeData(defaultIncomeData);
    } else if (statementType === "balance") {
      setBalanceData(defaultBalanceData);
    } else if (statementType === "cashflow") {
      setCashFlowData(defaultCashFlowData);
    } else if (statementType === "equity") {
      setEquityData(defaultOwnersEquityData);
    }
    setShowOutput(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDataParsed = (data: ParsedFileData) => {
    if (data.incomeData) {
      setIncomeData((prev) => ({
        ...prev,
        ...data.incomeData,
        revenue: { ...prev.revenue, ...data.incomeData?.revenue },
        expenses: { ...prev.expenses, ...data.incomeData?.expenses },
      }));
      toast.success("Income statement data imported");
    }
    if (data.balanceData) {
      setBalanceData((prev) => ({
        ...prev,
        ...data.balanceData,
        assets: { ...prev.assets, ...data.balanceData?.assets },
        liabilities: { ...prev.liabilities, ...data.balanceData?.liabilities },
        equity: { ...prev.equity, ...data.balanceData?.equity },
      }));
      toast.success("Balance sheet data imported");
    }
    if (data.transactions.length > 0) {
      setTransactions(data.transactions);
      toast.success(`${data.transactions.length} transactions imported`);
    }
    setShowUpload(false);
    setShowOutput(true);
  };
  const renderForm = () => {
    switch (statementType) {
      case "income":
        return (
          <IncomeStatementForm data={incomeData} onChange={setIncomeData} />
        );
      case "balance":
        return (
          <BalanceSheetForm data={balanceData} onChange={setBalanceData} />
        );

      case "cashflow":
        return <CashFlowForm data={cashFlowData} onChange={setCashFlowData} />;

      case "equity":
        return <OwnersEquityForm data={equityData} onChange={setEquityData} />;
      case "summary":
        return null;
      default:
        return null;
    }
  };
  const renderOutput = () => {
    switch (statementType) {
      case "income":
        return <IncomeStatementOutput data={incomeData} />;
      case "balance":
        return <BalanceSheetOutput data={balanceData} />;
      case "cashflow":
        return <CashFlowOutput data={cashFlowData} />;
      case "equity":
        return <OwnersEquityOutput data={equityData} />;
      case "summary":
        return (
          <FinancialSummaryPanel
            transactions={transactions}
            companyName={
              incomeData.companyName || balanceData.companyName || "Company"
            }
          />
        );
      default:
        return null;
    }
  };

  const getStatementLabel = () => {
    switch (statementType) {
      case "income":
        return "Income Statement";
      case "balance":
        return "Balance Sheet";
      case "cashflow":
        return "Cash Flow Statement";
      case "equity":
        return "Statement of Owner's Equity";
      case "summary":
        return "Financial Summary";
      default:
        return "Statement";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="no-print">
            <StatementTypeTabs
              value={statementType}
              onChange={(type) => {
                setStatementType(type);
                setShowOutput(false);
              }}
            />
          </div>

          {statementType === "summary" ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Financial Summary & Analytics
                </h2>
                <ExportPanel
                  statementType={statementType}
                  incomeData={incomeData}
                  balanceData={balanceData}
                  cashFlowData={cashFlowData}
                  transactions={transactions}
                  companyName={
                    incomeData.companyName ||
                    balanceData.companyName ||
                    "Company"
                  }
                />
              </div>
              <FinancialSummaryPanel
                transactions={transactions}
                companyName={
                  incomeData.companyName || balanceData.companyName || "Company"
                }
              />
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="no-print space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Enter Financial Data
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUpload(!showUpload)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>

                {showUpload && <FileUpload onDataParsed={handleDataParsed} />}

                {renderForm()}

                <div className="flex gap-3">
                  <Button
                    onClick={handleGenerate}
                    variant="default"
                    size="lg"
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Statement
                  </Button>
                  {showOutput && (
                    <Button onClick={handlePrint} variant="outline" size="lg">
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  )}
                </div>

                {showOutput && (
                  <ExportPanel
                    statementType={statementType}
                    incomeData={incomeData}
                    balanceData={balanceData}
                    cashFlowData={cashFlowData}
                    transactions={transactions}
                    companyName={
                      incomeData.companyName ||
                      balanceData.companyName ||
                      "Company"
                    }
                  />
                )}
              </div>

              <div className="space-y-6">
                <Tabs defaultValue="statement" className="no-print">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="statement" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Statement
                    </TabsTrigger>
                    <TabsTrigger value="predict" className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      AI Predict
                    </TabsTrigger>
                    <TabsTrigger value="forecast" className="gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Forecast
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="statement" className="mt-6">
                    <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                      Generated {getStatementLabel()}
                    </h2>
                    {showOutput ? (
                      renderOutput()
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 p-12 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                          No Statement Generated
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                          Enter your financial data on the left and click
                          "Generate Statement" to create your{" "}
                          {getStatementLabel()}.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="predict" className="mt-6">
                    <PredictionPanel data={incomeData} />
                  </TabsContent>
                  <TabsContent value="forecast" className="mt-6">
                    <ForecastPanel
                      incomeData={incomeData}
                      balanceData={balanceData}
                      cashFlowData={cashFlowData}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="no-print border-t border-border bg-card py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>FinanceFlow — Professional Financial Statement Generator</p>
        </div>
      </footer>
    </div>
  );
}

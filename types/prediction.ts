export interface PredictionProjection {
  period: string;
  revenue: {
    sales: number;
    services: number;
    other: number;
  };
  expenses: {
    costOfGoodsSold: number;
    salaries: number;
    rent: number;
    utilities: number;
    marketing: number;
    depreciation: number;
    other: number;
  };
  totalRevenue: number;
  netIncome: number;
  growthRate: number;
}

export interface TrendAnalysis {
  revenueGrowth: string;
  profitabilityTrend: string;
  expensePattern: string;
  overallOutlook: 'positive' | 'neutral' | 'negative';
}

export interface PredictionResponse {
  projections: PredictionProjection[];
  trendAnalysis: TrendAnalysis;
  keyInsights: string[];
}

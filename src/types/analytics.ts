export type AnalyticsTimeRange = '7d' | '30d' | '90d' | '1y';

export type MetricCategory = 'steps' | 'sleep' | 'heart' | 'overall';

export interface HealthTrend {
  date: string;
  value: number;
  previousValue?: number;
}

export interface MetricSnapshot {
  category: MetricCategory;
  currentValue: number;
  previousValue: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  average: number;
  best: number;
  worst: number;
  dataPoints: HealthTrend[];
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'summary';
  title: string;
  subtitle?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface AnalyticsDashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  createdAt: string;
  updatedAt: string;
}

export interface HealthInsight {
  id: string;
  type: 'achievement' | 'warning' | 'tip' | 'comparison';
  title: string;
  description: string;
  metric?: MetricCategory;
  value?: number;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

export interface WeeklySummary {
  week: string;
  startDate: string;
  endDate: string;
  totalSteps: number;
  averageHeartRate: number;
  averageSleepScore: number;
  activeDays: number;
  streak: number;
  healthScore: number;
  insights: HealthInsight[];
}

export interface AnalyticsState {
  selectedTimeRange: AnalyticsTimeRange;
  snapshots: Record<MetricCategory, MetricSnapshot>;
  trends: Record<MetricCategory, HealthTrend[]>;
  insights: HealthInsight[];
  weeklySummaries: WeeklySummary[];
  dashboards: AnalyticsDashboard[];
  isLoading: boolean;
  lastUpdated: string | null;
}

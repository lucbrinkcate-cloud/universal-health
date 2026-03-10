import { create } from 'zustand';
import {
  AnalyticsTimeRange,
  MetricCategory,
  MetricSnapshot,
  HealthTrend,
  HealthInsight,
  WeeklySummary,
  AnalyticsDashboard,
} from '../types/analytics';

interface AnalyticsStore {
  selectedTimeRange: AnalyticsTimeRange;
  snapshots: Record<MetricCategory, MetricSnapshot>;
  trends: Record<MetricCategory, HealthTrend[]>;
  insights: HealthInsight[];
  weeklySummaries: WeeklySummary[];
  dashboards: AnalyticsDashboard[];
  isLoading: boolean;
  lastUpdated: string | null;

  setSelectedTimeRange: (range: AnalyticsTimeRange) => void;
  fetchAnalytics: () => void;
  getSnapshot: (category: MetricCategory) => MetricSnapshot | undefined;
  getInsights: () => HealthInsight[];
}

const generateMockTrends = (category: MetricCategory, days: number): HealthTrend[] => {
  const trends: HealthTrend[] = [];
  const baseValues: Record<MetricCategory, number> = {
    steps: 8000,
    sleep: 75,
    heart: 72,
    overall: 85,
  };

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const variance = Math.random() * 2000 - 1000;
    const value = Math.round(baseValues[category] + variance);
    trends.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, value),
    });
  }
  return trends;
};

const generateMockSnapshot = (category: MetricCategory): MetricSnapshot => {
  const categoryConfig: Record<MetricCategory, { current: number; avg: number; best: number; worst: number; unit: string }> = {
    steps: { current: 8542, avg: 7500, best: 12500, worst: 3200, unit: 'steps' },
    sleep: { current: 82, avg: 78, best: 95, worst: 55, unit: 'score' },
    heart: { current: 68, avg: 72, best: 58, worst: 95, unit: 'bpm' },
    overall: { current: 87, avg: 82, best: 95, worst: 60, unit: 'score' },
  };

  const config = categoryConfig[category];
  const previousValue = config.avg + Math.round(Math.random() * 2000 - 1000);
  const changePercent = ((config.current - previousValue) / previousValue) * 100;

  return {
    category,
    currentValue: config.current,
    previousValue,
    changePercent: Math.round(changePercent * 10) / 10,
    trend: changePercent > 2 ? 'up' : changePercent < -2 ? 'down' : 'stable',
    average: config.avg,
    best: config.best,
    worst: config.worst,
    dataPoints: generateMockTrends(category, 30),
  };
};

const generateMockInsights = (): HealthInsight[] => [
  {
    id: 'insight_1',
    type: 'achievement',
    title: 'New Personal Best!',
    description: 'You reached 12,500 steps yesterday - your highest this month!',
    metric: 'steps',
    value: 12500,
    timestamp: new Date().toISOString(),
    priority: 'high',
  },
  {
    id: 'insight_2',
    type: 'tip',
    title: 'Improve Your Sleep',
    description: 'Going to bed 30 minutes earlier could improve your sleep score by up to 10%.',
    metric: 'sleep',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    priority: 'medium',
  },
  {
    id: 'insight_3',
    type: 'comparison',
    title: 'Above Average',
    description: 'Your heart rate variability is 15% higher than users in your age group.',
    metric: 'heart',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    priority: 'low',
  },
  {
    id: 'insight_4',
    type: 'warning',
    title: 'Activity Alert',
    description: "You've been less active this week. Try to increase your daily steps by 2,000.",
    metric: 'steps',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    priority: 'medium',
  },
];

const generateWeeklySummaries = (): WeeklySummary[] => {
  const summaries: WeeklySummary[] = [];
  for (let i = 0; i < 4; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 7);
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - 6);
    
    summaries.push({
      week: `Week ${4 - i}`,
      startDate: startDate.toISOString().split('T')[0],
      endDate: date.toISOString().split('T')[0],
      totalSteps: Math.round(50000 + Math.random() * 30000),
      averageHeartRate: Math.round(68 + Math.random() * 10),
      averageSleepScore: Math.round(75 + Math.random() * 15),
      activeDays: Math.round(5 + Math.random() * 2),
      streak: Math.round(3 + Math.random() * 10),
      healthScore: Math.round(80 + Math.random() * 15),
      insights: [],
    });
  }
  return summaries;
};

const generateMockDashboards = (): AnalyticsDashboard[] => [
  {
    id: 'default',
    name: 'Health Overview',
    description: 'Your main health metrics at a glance',
    widgets: [
      { id: 'w1', type: 'metric', title: 'Steps', position: { x: 0, y: 0 }, size: { width: 1, height: 1 } },
      { id: 'w2', type: 'metric', title: 'Heart Rate', position: { x: 1, y: 0 }, size: { width: 1, height: 1 } },
      { id: 'w3', type: 'chart', title: 'Trends', position: { x: 0, y: 1 }, size: { width: 2, height: 2 } },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  selectedTimeRange: '30d',
  snapshots: {
    steps: generateMockSnapshot('steps'),
    sleep: generateMockSnapshot('sleep'),
    heart: generateMockSnapshot('heart'),
    overall: generateMockSnapshot('overall'),
  },
  trends: {
    steps: generateMockTrends('steps', 30),
    sleep: generateMockTrends('sleep', 30),
    heart: generateMockTrends('heart', 30),
    overall: generateMockTrends('overall', 30),
  },
  insights: generateMockInsights(),
  weeklySummaries: generateWeeklySummaries(),
  dashboards: generateMockDashboards(),
  isLoading: false,
  lastUpdated: new Date().toISOString(),

  setSelectedTimeRange: (range: AnalyticsTimeRange) => {
    set({ selectedTimeRange: range });
    get().fetchAnalytics();
  },

  fetchAnalytics: () => {
    set({ isLoading: true });
    setTimeout(() => {
      const { selectedTimeRange } = get();
      const daysMap: Record<AnalyticsTimeRange, number> = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365,
      };
      const days = daysMap[selectedTimeRange];

      const categories: MetricCategory[] = ['steps', 'sleep', 'heart', 'overall'];
      const newSnapshots: Record<MetricCategory, MetricSnapshot> = {} as Record<MetricCategory, MetricSnapshot>;
      const newTrends: Record<MetricCategory, HealthTrend[]> = {} as Record<MetricCategory, HealthTrend[]>;

      categories.forEach(category => {
        newSnapshots[category] = generateMockSnapshot(category);
        newTrends[category] = generateMockTrends(category, days);
      });

      set({
        snapshots: newSnapshots,
        trends: newTrends,
        isLoading: false,
        lastUpdated: new Date().toISOString(),
      });
    }, 500);
  },

  getSnapshot: (category: MetricCategory) => {
    return get().snapshots[category];
  },

  getInsights: () => {
    return get().insights.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  },
}));

export default useAnalyticsStore;

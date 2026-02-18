import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useAnalyticsStore } from '../../stores';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { AnalyticsTimeRange, MetricCategory, HealthInsight, WeeklySummary } from '../../types/analytics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TIME_RANGES: { value: AnalyticsTimeRange; label: string }[] = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '1y', label: '1 Year' },
];

const CATEGORIES: { value: MetricCategory; label: string; icon: string; unit: string }[] = [
  { value: 'steps', label: 'Steps', icon: '👟', unit: 'steps' },
  { value: 'sleep', label: 'Sleep', icon: '😴', unit: 'score' },
  { value: 'heart', label: 'Heart', icon: '❤️', unit: 'bpm' },
  { value: 'overall', label: 'Overall', icon: '⭐', unit: 'score' },
];

type TabType = 'overview' | 'trends' | 'insights' | 'summary';

export const AnalyticsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const {
    selectedTimeRange,
    snapshots,
    trends,
    insights,
    weeklySummaries,
    isLoading,
    setSelectedTimeRange,
    fetchAnalytics,
    getSnapshot,
    getInsights,
  } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const onRefresh = () => {
    fetchAnalytics();
  };

  const renderTimeRangeSelector = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeRangeContainer}>
      {TIME_RANGES.map((range) => (
        <Pressable
          key={range.value}
          style={[styles.timeRangeButton, selectedTimeRange === range.value && styles.timeRangeButtonActive]}
          onPress={() => setSelectedTimeRange(range.value)}
        >
          <Text style={[styles.timeRangeText, selectedTimeRange === range.value && styles.timeRangeTextActive]}>
            {range.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );

  const renderMetricCard = (category: MetricCategory, label: string, icon: string) => {
    const snapshot = getSnapshot(category);
    if (!snapshot) return null;

    const trendIcon = snapshot.trend === 'up' ? '↑' : snapshot.trend === 'down' ? '↓' : '→';
    const trendColor = snapshot.trend === 'up' ? COLORS.success : snapshot.trend === 'down' ? COLORS.error : COLORS.textSecondary;

    return (
      <View key={category} style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <Text style={styles.metricIcon}>{icon}</Text>
          <Text style={styles.metricLabel}>{label}</Text>
        </View>
        <Text style={styles.metricValue}>{snapshot.currentValue.toLocaleString()}</Text>
        <View style={styles.metricFooter}>
          <Text style={[styles.metricChange, { color: trendColor }]}>
            {trendIcon} {Math.abs(snapshot.changePercent)}%
          </Text>
          <Text style={styles.metricAverage}>Avg: {snapshot.average.toLocaleString()}</Text>
        </View>
      </View>
    );
  };

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      <Text style={styles.sectionTitle}>Health Snapshots</Text>
      <View style={styles.metricsGrid}>
        {CATEGORIES.map((cat) => renderMetricCard(cat.value, cat.label, cat.icon))}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>This Week</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{weeklySummaries[0]?.totalSteps.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Total Steps</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{weeklySummaries[0]?.averageSleepScore}</Text>
            <Text style={styles.summaryLabel}>Sleep Score</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{weeklySummaries[0]?.healthScore}</Text>
            <Text style={styles.summaryLabel}>Health Score</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTrends = () => (
    <View style={styles.trendsContainer}>
      {CATEGORIES.map((cat) => {
        const snapshot = getSnapshot(cat.value);
        if (!snapshot) return null;

        return (
          <View key={cat.value} style={styles.trendCard}>
            <View style={styles.trendHeader}>
              <Text style={styles.trendIcon}>{cat.icon}</Text>
              <Text style={styles.trendTitle}>{cat.label}</Text>
            </View>
            <View style={styles.trendStats}>
              <View style={styles.trendStat}>
                <Text style={styles.trendStatLabel}>Best</Text>
                <Text style={[styles.trendStatValue, { color: COLORS.success }]}>{snapshot.best.toLocaleString()}</Text>
              </View>
              <View style={styles.trendStat}>
                <Text style={styles.trendStatLabel}>Average</Text>
                <Text style={styles.trendStatValue}>{snapshot.average.toLocaleString()}</Text>
              </View>
              <View style={styles.trendStat}>
                <Text style={styles.trendStatLabel}>Lowest</Text>
                <Text style={[styles.trendStatValue, { color: COLORS.error }]}>{snapshot.worst.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.trendBar}>
              <View style={[styles.trendBarFill, { width: `${(snapshot.currentValue / snapshot.best) * 100}%` }]} />
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderInsightIcon = (type: HealthInsight['type']) => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'warning': return '⚠️';
      case 'tip': return '💡';
      case 'comparison': return '📊';
      default: return '📌';
    }
  };

  const renderInsights = () => {
    const sortedInsights = getInsights();
    return (
      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>Health Insights</Text>
        {sortedInsights.map((insight) => (
          <View key={insight.id} style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightIcon}>{renderInsightIcon(insight.type)}</Text>
              <View style={styles.insightTitleContainer}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <View style={[styles.priorityBadge, { backgroundColor: insight.priority === 'high' ? COLORS.error : insight.priority === 'medium' ? COLORS.warning : COLORS.textSecondary }]}>
                  <Text style={styles.priorityText}>{insight.priority}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.insightDescription}>{insight.description}</Text>
            <Text style={styles.insightTimestamp}>
              {new Date(insight.timestamp).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.sectionTitle}>Weekly Summaries</Text>
      {weeklySummaries.map((week: WeeklySummary, index: number) => (
        <View key={week.week} style={styles.weekCard}>
          <View style={styles.weekHeader}>
            <Text style={styles.weekTitle}>{week.week}</Text>
            <Text style={styles.weekDates}>{week.startDate} - {week.endDate}</Text>
          </View>
          <View style={styles.weekStats}>
            <View style={styles.weekStat}>
              <Text style={styles.weekStatValue}>{week.totalSteps.toLocaleString()}</Text>
              <Text style={styles.weekStatLabel}>Steps</Text>
            </View>
            <View style={styles.weekStat}>
              <Text style={styles.weekStatValue}>{week.averageHeartRate}</Text>
              <Text style={styles.weekStatLabel}>Avg HR</Text>
            </View>
            <View style={styles.weekStat}>
              <Text style={styles.weekStatValue}>{week.averageSleepScore}</Text>
              <Text style={styles.weekStatLabel}>Sleep</Text>
            </View>
            <View style={styles.weekStat}>
              <Text style={styles.weekStatValue}>{week.healthScore}</Text>
              <Text style={styles.weekStatLabel}>Score</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Health trends & insights</Text>
      </View>

      {renderTimeRangeSelector()}

      <View style={styles.tabs}>
        {(['overview', 'trends', 'insights', 'summary'] as TabType[]).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'trends' && renderTrends()}
        {activeTab === 'insights' && renderInsights()}
        {activeTab === 'summary' && renderSummary()}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
    paddingTop: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  timeRangeContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  timeRangeButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
  },
  timeRangeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  timeRangeText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: COLORS.textLight,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  overviewContainer: {
    paddingBottom: SPACING.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  metricCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  metricIcon: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  metricLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  metricValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  metricFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  metricChange: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  metricAverage: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  summaryTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  trendsContainer: {
    paddingBottom: SPACING.md,
  },
  trendCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  trendIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  trendTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  trendStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  trendStat: {
    alignItems: 'center',
  },
  trendStatLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  trendStatValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  trendBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  trendBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  insightsContainer: {
    paddingBottom: SPACING.md,
  },
  insightCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  insightTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  priorityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  priorityText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  insightDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  insightTimestamp: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  summaryContainer: {
    paddingBottom: SPACING.md,
  },
  weekCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  weekTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  weekDates: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  weekStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weekStat: {
    alignItems: 'center',
  },
  weekStatValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  weekStatLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  bottomPadding: {
    height: SPACING.xxl,
  },
});

export default AnalyticsScreen;

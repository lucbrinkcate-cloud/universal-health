import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useHealthStore } from '../../stores';
import { HealthCard, SleepChart, Loading, ErrorView } from '../../components';
import { COLORS, SPACING, FONT_SIZE } from '../../constants';
import { formatTime, getRelativeTime } from '../../utils';

export const DashboardScreen: React.FC = () => {
  const { healthData, isLoading, error, fetchHealthData, useMockData, clearError } =
    useHealthStore();

  useEffect(() => {
    fetchHealthData();
  }, []);

  const onRefresh = () => {
    fetchHealthData();
  };

  if (isLoading && !healthData) {
    return <Loading fullScreen message="Loading your health data..." />;
  }

  if (error && !healthData) {
    return (
      <View style={styles.errorContainer}>
        <ErrorView message={error} onRetry={onRefresh} />
        <View style={styles.demoButton}>
          <Text style={styles.demoText}>Or try with demo data:</Text>
          <Text style={styles.demoButtonText} onPress={useMockData}>
            Load Demo Data
          </Text>
        </View>
      </View>
    );
  }

  const data = healthData;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Today's Health</Text>
        <Text style={styles.lastUpdated}>
          Updated {getRelativeTime(data?.lastUpdated || new Date())}
        </Text>
      </View>

      <View style={styles.cardsGrid}>
        <HealthCard
          title="Steps"
          value={data?.steps || 0}
          unit="steps"
          icon="👟"
          color={COLORS.steps}
          style={styles.card}
        />
        <HealthCard
          title="Heart Rate"
          value={data?.heartRate || 0}
          unit="bpm"
          icon="❤️"
          color={COLORS.heartRate}
          style={styles.card}
        />
        <HealthCard
          title="Sleep Score"
          value={data?.sleepData?.score || 0}
          unit="/ 100"
          icon="😴"
          color={COLORS.sleep}
          style={styles.card}
        />
        <HealthCard
          title="Total Sleep"
          value={formatTime(data?.sleepData?.totalMinutes || 0)}
          icon="🌙"
          color={COLORS.sleep}
          style={styles.card}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sleep Stages</Text>
        {data?.sleepData && (
          <SleepChart data={data.sleepData} />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Deep Sleep</Text>
            <Text style={styles.statValue}>
              {formatTime(data?.sleepData?.deepMinutes || 0)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Light Sleep</Text>
            <Text style={styles.statValue}>
              {formatTime(data?.sleepData?.lightMinutes || 0)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>REM Sleep</Text>
            <Text style={styles.statValue}>
              {formatTime(data?.sleepData?.remMinutes || 0)}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  lastUpdated: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  card: {
    width: '48%',
    marginBottom: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  demoButton: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  demoText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  demoButtonText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
});

export default DashboardScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useHealthStore } from '../../stores';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { VO2MaxCalculator, HRVAnalyzer, SleepAnalyzer } from '../../utils/biologicalEngine';
import { ProgressCard } from '../../components';

type TabType = 'overview' | 'cardio' | 'recovery' | 'sleep';

export const BiometricsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { extendedHealthData } = useHealthStore();
  
  // Mock user profile - in real app, this would come from user settings
  const userProfile = {
    age: 30,
    gender: 'male' as 'male' | 'female',
    weight: 75,
    height: 175,
    maxHeartRate: 190,
    restingHeartRate: 60,
  };

  const calculateVO2Max = () => {
    if (!extendedHealthData) return null;
    
    const vo2max = VO2MaxCalculator.calculateUth(
      userProfile.restingHeartRate,
      userProfile.maxHeartRate
    );
    
    const category = VO2MaxCalculator.getFitnessCategory(
      vo2max,
      userProfile.age,
      userProfile.gender
    );
    
    return { value: vo2max, category };
  };

  const analyzeHRV = () => {
    if (!extendedHealthData || !extendedHealthData.heartRateData.length) return null;
    
    // Convert heart rate readings to RR intervals (mock conversion)
    const rrIntervals = extendedHealthData.heartRateData.map(hr => 60000 / hr.value);
    
    const rmssd = HRVAnalyzer.calculateRMSSD(rrIntervals);
    const sdnn = HRVAnalyzer.calculateSDNN(rrIntervals);
    const pnn50 = HRVAnalyzer.calculatePNN50(rrIntervals);
    
    const recovery = HRVAnalyzer.analyzeRecovery(rrIntervals, userProfile);
    const baseline = HRVAnalyzer.getBaselineHRV(userProfile.age, userProfile.gender);
    
    return { rmssd, sdnn, pnn50, recovery, baseline };
  };

  const analyzeSleep = () => {
    if (!extendedHealthData || !extendedHealthData.sleepData.totalMinutes) return null;
    
    const architecture = SleepAnalyzer.analyzeSleepArchitecture(extendedHealthData.sleepData);
    const efficiency = SleepAnalyzer.calculateEfficiency(extendedHealthData.sleepData);
    const optimalBedtime = SleepAnalyzer.predictOptimalBedtime('07:00', 8);
    
    return { architecture, efficiency, optimalBedtime };
  };

  const vo2max = calculateVO2Max();
  const hrv = analyzeHRV();
  const sleep = analyzeSleep();

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      <View style={styles.metricCard}>
        <Text style={styles.metricIcon}>🫁</Text>
        <Text style={styles.metricLabel}>VO₂ Max</Text>
        <Text style={styles.metricValue}>
          {vo2max ? vo2max.value : '--'}
        </Text>
        <Text style={styles.metricUnit}>ml/kg/min</Text>
        {vo2max && (
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(vo2max.category) }]}>
            <Text style={styles.categoryText}>{vo2max.category}</Text>
          </View>
        )}
      </View>

      <View style={styles.metricCard}>
        <Text style={styles.metricIcon}>💓</Text>
        <Text style={styles.metricLabel}>HRV (RMSSD)</Text>
        <Text style={styles.metricValue}>
          {hrv ? hrv.rmssd : '--'}
        </Text>
        <Text style={styles.metricUnit}>ms</Text>
        {hrv && (
          <Text style={styles.comparisonText}>
            vs {hrv.baseline} avg
          </Text>
        )}
      </View>

      <View style={styles.metricCard}>
        <Text style={styles.metricIcon}>😴</Text>
        <Text style={styles.metricLabel}>Sleep Efficiency</Text>
        <Text style={styles.metricValue}>
          {sleep ? `${sleep.efficiency}%` : '--'}
        </Text>
        {sleep && (
          <View style={[styles.categoryBadge, { backgroundColor: getSleepColor(sleep.architecture.quality) }]}>
            <Text style={styles.categoryText}>{sleep.architecture.quality}</Text>
          </View>
        )}
      </View>

      <View style={styles.metricCard}>
        <Text style={styles.metricIcon}>🔋</Text>
        <Text style={styles.metricLabel}>Recovery Score</Text>
        <Text style={styles.metricValue}>
          {hrv ? hrv.recovery.score : '--'}
        </Text>
        <Text style={styles.metricUnit}>/ 100</Text>
        {hrv && (
          <Text style={styles.recommendationText} numberOfLines={2}>
            {hrv.recovery.recommendation}
          </Text>
        )}
      </View>
    </View>
  );

  const renderCardio = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>VO₂ Max Analysis</Text>
        <Text style={styles.detailDescription}>
          VO₂ max measures your body's ability to consume oxygen during exercise. 
          Higher values indicate better cardiovascular fitness.
        </Text>
        
        {vo2max && (
          <>
            <View style={styles.vo2Container}>
              <Text style={styles.vo2Value}>{vo2max.value}</Text>
              <Text style={styles.vo2Unit}>ml/kg/min</Text>
            </View>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(vo2max.category), alignSelf: 'center' }]}>
              <Text style={styles.categoryText}>{vo2max.category} Fitness</Text>
            </View>
            
            <Text style={styles.comparisonTitle}>Your Fitness Level</Text>
            <View style={styles.fitnessScale}>
              {['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent', 'Superior'].map((level, index) => (
                <View 
                  key={level} 
                  style={[
                    styles.fitnessLevel,
                    vo2max.category === level && styles.fitnessLevelActive
                  ]}
                >
                  <Text style={[
                    styles.fitnessLevelText,
                    vo2max.category === level && styles.fitnessLevelTextActive
                  ]}>
                    {level}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>Heart Rate Zones</Text>
        <Text style={styles.detailDescription}>
          Training in different heart rate zones helps you achieve specific fitness goals.
        </Text>
        
        {[
          { zone: 'Rest', range: '0-60', color: '#3B82F6', description: 'Recovery and rest' },
          { zone: 'Fat Burn', range: '60-100', color: '#10B981', description: 'Weight management' },
          { zone: 'Cardio', range: '100-140', color: '#F59E0B', description: 'Endurance training' },
          { zone: 'Peak', range: '140+', color: '#EF4444', description: 'High intensity' },
        ].map((item) => (
          <View key={item.zone} style={styles.zoneRow}>
            <View style={[styles.zoneIndicator, { backgroundColor: item.color }]} />
            <View style={styles.zoneInfo}>
              <Text style={styles.zoneName}>{item.zone}</Text>
              <Text style={styles.zoneRange}>{item.range} bpm</Text>
            </View>
            <Text style={styles.zoneDescription}>{item.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderRecovery = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>HRV Analysis</Text>
        <Text style={styles.detailDescription}>
          Heart Rate Variability (HRV) measures the variation in time between heartbeats. 
          Higher HRV generally indicates better recovery and fitness.
        </Text>
        
        {hrv && (
          <>
            <View style={styles.hrvMetrics}>
              <View style={styles.hrvMetric}>
                <Text style={styles.hrvValue}>{hrv.rmssd}</Text>
                <Text style={styles.hrvLabel}>RMSSD (ms)</Text>
              </View>
              <View style={styles.hrvMetric}>
                <Text style={styles.hrvValue}>{hrv.sdnn}</Text>
                <Text style={styles.hrvLabel}>SDNN (ms)</Text>
              </View>
              <View style={styles.hrvMetric}>
                <Text style={styles.hrvValue}>{hrv.pnn50}%</Text>
                <Text style={styles.hrvLabel}>pNN50</Text>
              </View>
            </View>

            <View style={styles.baselineComparison}>
              <Text style={styles.baselineTitle}>vs. Your Age Group</Text>
              <View style={styles.baselineBar}>
                <View style={styles.baselineMarker}>
                  <Text style={styles.baselineLabel}>Baseline: {hrv.baseline}ms</Text>
                </View>
                <View 
                  style={[
                    styles.currentMarker, 
                    { left: `${Math.min(100, (hrv.rmssd / (hrv.baseline * 1.5)) * 100)}%` }
                  ]}
                >
                  <Text style={styles.currentLabel}>You: {hrv.rmssd}ms</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>Recovery Status</Text>
        
        {hrv && (
          <>
            <View style={styles.recoveryScore}>
              <Text style={styles.recoveryValue}>{hrv.recovery.readiness}%</Text>
              <Text style={styles.recoveryLabel}>Readiness Score</Text>
            </View>
            
            <View style={[styles.statusBadge, { backgroundColor: getRecoveryColor(hrv.recovery.status) }]}>
              <Text style={styles.statusText}>{hrv.recovery.status.toUpperCase()}</Text>
            </View>
            
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationTitle}>💡 Recommendation</Text>
              <Text style={styles.recommendationDetail}>{hrv.recovery.recommendation}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );

  const renderSleep = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>Sleep Architecture</Text>
        <Text style={styles.detailDescription}>
          A healthy sleep cycle includes the right balance of deep, light, and REM sleep.
        </Text>
        
        {sleep && (
          <>
            <View style={styles.sleepStages}>
              <View style={styles.sleepStage}>
                <Text style={styles.stageIcon}>🌊</Text>
                <Text style={styles.stageName}>Deep</Text>
                <Text style={styles.stageValue}>{sleep.architecture.deepPercentage}%</Text>
                <Text style={styles.stageTarget}>Target: 15-20%</Text>
              </View>
              <View style={styles.sleepStage}>
                <Text style={styles.stageIcon}>💫</Text>
                <Text style={styles.stageName}>Light</Text>
                <Text style={styles.stageValue}>{sleep.architecture.lightPercentage}%</Text>
                <Text style={styles.stageTarget}>Target: 45-55%</Text>
              </View>
              <View style={styles.sleepStage}>
                <Text style={styles.stageIcon}>🧠</Text>
                <Text style={styles.stageName}>REM</Text>
                <Text style={styles.stageValue}>{sleep.architecture.remPercentage}%</Text>
                <Text style={styles.stageTarget}>Target: 20-25%</Text>
              </View>
            </View>

            {sleep.architecture.recommendations.length > 0 && (
              <View style={styles.recommendationsList}>
                <Text style={styles.recommendationsTitle}>💡 Sleep Tips</Text>
                {sleep.architecture.recommendations.map((rec, index) => (
                  <Text key={index} style={styles.recommendationItem}>• {rec}</Text>
                ))}
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>Sleep Efficiency</Text>
        
        {sleep && (
          <>
            <View style={styles.efficiencyCircle}>
              <Text style={styles.efficiencyValue}>{sleep.efficiency}%</Text>
              <Text style={styles.efficiencyLabel}>Efficient</Text>
            </View>
            
            <View style={styles.bedtimeSuggestion}>
              <Text style={styles.bedtimeIcon}>🌙</Text>
              <View>
                <Text style={styles.bedtimeLabel}>Suggested Bedtime</Text>
                <Text style={styles.bedtimeValue}>{sleep.optimalBedtime}</Text>
                <Text style={styles.bedtimeNote}>for 7:00 AM wake-up</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Superior': return '#4C1D95';
      case 'Excellent': return '#10B981';
      case 'Good': return '#3B82F6';
      case 'Fair': return '#F59E0B';
      case 'Poor':
      case 'Very Poor': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSleepColor = (quality: string): string => {
    switch (quality) {
      case 'excellent': return '#10B981';
      case 'good': return '#3B82F6';
      case 'fair': return '#F59E0B';
      case 'poor': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getRecoveryColor = (status: string): string => {
    switch (status) {
      case 'excellent': return '#10B981';
      case 'good': return '#3B82F6';
      case 'fair': return '#F59E0B';
      case 'poor': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Biometrics</Text>
        <Text style={styles.subtitle}>Advanced Health Analytics</Text>
      </View>

      <ProgressCard />

      <View style={styles.tabs}>
        <Pressable 
          style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>Overview</Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'cardio' && styles.tabActive]}
          onPress={() => setActiveTab('cardio')}
        >
          <Text style={[styles.tabText, activeTab === 'cardio' && styles.tabTextActive]}>Cardio</Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'recovery' && styles.tabActive]}
          onPress={() => setActiveTab('recovery')}
        >
          <Text style={[styles.tabText, activeTab === 'recovery' && styles.tabTextActive]}>Recovery</Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'sleep' && styles.tabActive]}
          onPress={() => setActiveTab('sleep')}
        >
          <Text style={[styles.tabText, activeTab === 'sleep' && styles.tabTextActive]}>Sleep</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'cardio' && renderCardio()}
        {activeTab === 'recovery' && renderRecovery()}
        {activeTab === 'sleep' && renderSleep()}
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
  },
  // Overview styles
  overviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  metricLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  metricValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  metricUnit: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
  },
  categoryBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
  },
  categoryText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  comparisonText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  recommendationText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  // Section styles
  sectionContainer: {
    padding: SPACING.md,
  },
  detailCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  detailTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  detailDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  // VO2 Max styles
  vo2Container: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  vo2Value: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.text,
  },
  vo2Unit: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  comparisonTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  fitnessScale: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fitnessLevel: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.border,
    marginHorizontal: 2,
  },
  fitnessLevelActive: {
    backgroundColor: COLORS.primary,
  },
  fitnessLevelText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  fitnessLevelTextActive: {
    color: COLORS.textLight,
    fontWeight: '600',
  },
  // Heart Rate Zones
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  zoneIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.md,
  },
  zoneInfo: {
    width: 100,
  },
  zoneName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  zoneRange: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  zoneDescription: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  // HRV styles
  hrvMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.lg,
  },
  hrvMetric: {
    alignItems: 'center',
  },
  hrvValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  hrvLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  baselineComparison: {
    marginTop: SPACING.md,
  },
  baselineTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  baselineBar: {
    height: 40,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    position: 'relative',
    justifyContent: 'center',
  },
  baselineMarker: {
    position: 'absolute',
    left: '50%',
    alignItems: 'center',
  },
  baselineLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  currentMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  currentLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  // Recovery styles
  recoveryScore: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  recoveryValue: {
    fontSize: 56,
    fontWeight: '700',
    color: COLORS.text,
  },
  recoveryLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  statusText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    fontWeight: '700',
  },
  recommendationBox: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  recommendationTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  recommendationDetail: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  // Sleep styles
  sleepStages: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.lg,
  },
  sleepStage: {
    alignItems: 'center',
  },
  stageIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  stageName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  stageValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  stageTarget: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  recommendationsList: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  recommendationsTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  recommendationItem: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  efficiencyCircle: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  efficiencyValue: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.text,
  },
  efficiencyLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  bedtimeSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  bedtimeIcon: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  bedtimeLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  bedtimeValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  bedtimeNote: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
});

export default BiometricsScreen;

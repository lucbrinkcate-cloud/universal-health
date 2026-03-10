import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { ExtendedHealthData } from '../types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants';
import { getHealthScoreLabel } from '../utils/healthScoreEngine';

interface BiometricDisplayProps {
  healthData: ExtendedHealthData;
}

interface MetricItemProps {
  icon: string;
  label: string;
  value: string | number;
  unit: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MetricItem: React.FC<MetricItemProps> = ({ icon, label, value, unit, color, trend }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  return (
    <Animated.View
      style={[
        styles.metricItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.metricIconContainer, { backgroundColor: color + '20' }]}>
        <Text style={styles.metricIcon}>{icon}</Text>
      </View>
      <View style={styles.metricContent}>
        <Text style={styles.metricLabel}>{label}</Text>
        <View style={styles.metricValueRow}>
          <Text style={[styles.metricValue, { color }]}>{value}</Text>
          <Text style={styles.metricUnit}>{unit}</Text>
          {trend && (
            <Text
              style={[
                styles.metricTrend,
                {
                  color:
                    trend === 'up'
                      ? COLORS.success
                      : trend === 'down'
                      ? COLORS.error
                      : COLORS.textSecondary,
                },
              ]}
            >
              {getTrendIcon()}
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

export const BiometricDisplay: React.FC<BiometricDisplayProps> = ({ healthData }) => {
  const { heartRate, spo2, stressLevel, sleepData, overallHealthScore, hrv, respiratoryRate } = healthData;
  const healthScoreInfo = getHealthScoreLabel(overallHealthScore);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.healthScoreContainer}>
        <Animated.View
          style={[
            styles.healthScoreCircle,
            {
              borderColor: healthScoreInfo.color,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Text style={[styles.healthScoreValue, { color: healthScoreInfo.color }]}>
            {overallHealthScore}
          </Text>
          <Text style={styles.healthScoreLabel}>{healthScoreInfo.label}</Text>
        </Animated.View>
        <Text style={styles.healthScoreTitle}>Health Score</Text>
      </View>

      <View style={styles.metricsGrid}>
        <MetricItem
          icon="❤️"
          label="Heart Rate"
          value={heartRate}
          unit="bpm"
          color={COLORS.heartRate}
          trend="stable"
        />
        <MetricItem
          icon="🫁"
          label="SpO2"
          value={spo2}
          unit="%"
          color={COLORS.info}
          trend="stable"
        />
        <MetricItem
          icon="😰"
          label="Stress"
          value={stressLevel}
          unit="score"
          color={COLORS.warning}
          trend={stressLevel > 50 ? 'up' : 'down'}
        />
        <MetricItem
          icon="😴"
          label="Sleep Score"
          value={sleepData.score}
          unit="/100"
          color={COLORS.sleep}
          trend={sleepData.score > 70 ? 'up' : 'down'}
        />
        <MetricItem
          icon="💓"
          label="HRV"
          value={hrv}
          unit="ms"
          color={COLORS.secondary}
          trend="stable"
        />
        <MetricItem
          icon="🌬️"
          label="Resp. Rate"
          value={respiratoryRate}
          unit="/min"
          color={COLORS.primary}
          trend="stable"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  healthScoreContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  healthScoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  healthScoreValue: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
  },
  healthScoreLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  healthScoreTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: (SCREEN_WIDTH - SPACING.md * 3) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  metricIcon: {
    fontSize: 18,
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
  },
  metricUnit: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  metricTrend: {
    fontSize: FONT_SIZE.md,
    marginLeft: SPACING.xs,
  },
});

export default BiometricDisplay;

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  ScrollView,
} from 'react-native';
import { BodyRegionData, BodyRegion } from '../types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants';
import { getStatusColor } from '../utils/healthScoreEngine';

interface BodyRegionDetailProps {
  visible: boolean;
  regionData: BodyRegionData | null;
  onClose: () => void;
}

interface MetricBarProps {
  label: string;
  value: number;
  unit: string;
  score: number;
  status: 'good' | 'warning' | 'alert';
  range: { min: number; max: number; optimal: number };
}

const MetricBar: React.FC<MetricBarProps> = ({ label, value, unit, score, status, range }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const color = getStatusColor(status);

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: score,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [score, widthAnim]);

  const getStatusAdvice = () => {
    if (status === 'good') {
      return 'Your levels are optimal. Keep up the great work!';
    }
    if (status === 'warning') {
      return 'Slightly outside optimal range. Consider lifestyle adjustments.';
    }
    return 'Outside healthy range. Consider consulting a healthcare provider.';
  };

  return (
    <View style={styles.metricBarContainer}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricLabel}>{label}</Text>
        <View style={styles.metricValueContainer}>
          <Text style={[styles.metricValue, { color }]}>{value}</Text>
          <Text style={styles.metricUnit}>{unit}</Text>
        </View>
      </View>
      
      <View style={styles.barBackground}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: color,
            },
          ]}
        />
        <View
          style={[
            styles.optimalMarker,
            { left: `${((range.optimal - range.min) / (range.max - range.min)) * 100}%` },
          ]}
        />
      </View>

      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>Min: {range.min}</Text>
        <Text style={styles.rangeLabel}>Optimal: {range.optimal}</Text>
        <Text style={styles.rangeLabel}>Max: {range.max}</Text>
      </View>

      <Text style={[styles.adviceText, { color }]}>{getStatusAdvice()}</Text>
    </View>
  );
};

export const BodyRegionDetail: React.FC<BodyRegionDetailProps> = ({
  visible,
  regionData,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim, slideAnim]);

  if (!regionData) return null;

  const statusColor = getStatusColor(regionData.status);

  const getStatusIcon = () => {
    switch (regionData.status) {
      case 'good':
        return '✓';
      case 'warning':
        return '!';
      case 'alert':
        return '⚠';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Pressable style={styles.overlayPressable} onPress={onClose} />
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.modalHandle} />
          
          <View style={styles.header}>
            <View style={[styles.statusIconContainer, { backgroundColor: statusColor + '20' }]}>
              <Text style={[styles.statusIcon, { color: statusColor }]}>
                {getStatusIcon()}
              </Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.regionName}>{regionData.name} System</Text>
              <View style={styles.scoreRow}>
                <Text style={[styles.scoreValue, { color: statusColor }]}>
                  {regionData.score}
                </Text>
                <Text style={styles.scoreLabel}>/ 100</Text>
              </View>
            </View>
          </View>

          <Text style={styles.statusDescription}>
            {regionData.status === 'good'
              ? 'All metrics are within healthy ranges'
              : regionData.status === 'warning'
              ? 'Some metrics need attention'
              : 'Several metrics require attention'}
          </Text>

          <ScrollView style={styles.metricsList} showsVerticalScrollIndicator={false}>
            {regionData.metrics.map((metric) => (
              <MetricBar
                key={metric.key}
                label={metric.label}
                value={metric.value}
                unit={metric.unit}
                score={metric.score}
                status={metric.status}
                range={metric.range}
              />
            ))}
          </ScrollView>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayPressable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  statusIcon: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerText: {
    flex: 1,
  },
  regionName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  statusDescription: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  metricsList: {
    maxHeight: 400,
  },
  metricBarContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  metricLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  metricUnit: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  barBackground: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  optimalMarker: {
    position: 'absolute',
    top: -4,
    width: 2,
    height: 16,
    backgroundColor: COLORS.text,
    borderRadius: 1,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  rangeLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  adviceText: {
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  closeButtonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});

export default BodyRegionDetail;

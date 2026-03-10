import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants';
import { SleepData } from '../types';
import { formatTime, sleepStageColors } from '../utils';

interface SleepChartProps {
  data: SleepData;
}

export const SleepChart: React.FC<SleepChartProps> = ({ data }) => {
  const totalMinutes = data.totalMinutes || 1;
  const stages = [
    { key: 'deep', label: 'Deep', minutes: data.deepMinutes, color: sleepStageColors.deep },
    { key: 'light', label: 'Light', minutes: data.lightMinutes, color: sleepStageColors.light },
    { key: 'rem', label: 'REM', minutes: data.remMinutes, color: sleepStageColors.rem },
    { key: 'awake', label: 'Awake', minutes: data.awakeMinutes, color: sleepStageColors.awake },
  ].filter(s => s.minutes > 0);

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <View style={styles.bar}>
          {stages.map((stage, index) => (
            <View
              key={stage.key}
              style={[
                styles.barSegment,
                {
                  backgroundColor: stage.color,
                  flex: stage.minutes / totalMinutes,
                  borderTopLeftRadius: index === 0 ? BORDER_RADIUS.md : 0,
                  borderBottomLeftRadius: index === 0 ? BORDER_RADIUS.md : 0,
                  borderTopRightRadius: index === stages.length - 1 ? BORDER_RADIUS.md : 0,
                  borderBottomRightRadius: index === stages.length - 1 ? BORDER_RADIUS.md : 0,
                },
              ]}
            />
          ))}
        </View>
      </View>
      <View style={styles.legend}>
        {stages.map((stage) => (
          <View key={stage.key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: stage.color }]} />
            <Text style={styles.legendLabel}>{stage.label}</Text>
            <Text style={styles.legendValue}>{formatTime(stage.minutes)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
  },
  chartContainer: {
    height: 40,
    marginBottom: SPACING.md,
  },
  bar: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  barSegment: {
    height: '100%',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: SPACING.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.xs,
  },
  legendLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  legendValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
});

export default SleepChart;

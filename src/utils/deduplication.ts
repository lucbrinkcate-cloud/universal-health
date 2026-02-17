import { HealthData, HeartRateReading, SleepData } from '../types';

interface DataSource {
  id: string;
  name: string;
  priority: number;
  reliability: number;
}

// Priority order for data sources (higher = more trusted)
const DATA_SOURCES: DataSource[] = [
  { id: 'apple_watch', name: 'Apple Watch', priority: 100, reliability: 0.95 },
  { id: 'garmin', name: 'Garmin', priority: 95, reliability: 0.93 },
  { id: 'whoop', name: 'Whoop', priority: 90, reliability: 0.92 },
  { id: 'oura', name: 'Oura Ring', priority: 90, reliability: 0.92 },
  { id: 'fitbit', name: 'Fitbit', priority: 85, reliability: 0.90 },
  { id: 'healthkit', name: 'Apple HealthKit', priority: 80, reliability: 0.88 },
  { id: 'health_connect', name: 'Google Health Connect', priority: 80, reliability: 0.88 },
  { id: 'phone', name: 'Phone Sensors', priority: 60, reliability: 0.75 },
  { id: 'manual', name: 'Manual Entry', priority: 50, reliability: 0.70 },
];

interface DataPoint {
  value: number;
  source: string;
  timestamp: string;
  confidence: number;
}

export class DeduplicationEngine {
  private sources: DataSource[];

  constructor() {
    this.sources = DATA_SOURCES;
  }

  // Merge multiple health data sources, removing duplicates
  mergeHealthData(dataSources: Array<{ data: HealthData; source: string }>): HealthData {
    if (dataSources.length === 0) {
      return this.createEmptyHealthData();
    }

    if (dataSources.length === 1) {
      return dataSources[0].data;
    }

    // Sort by priority (highest first)
    const sortedSources = dataSources.sort((a, b) => {
      const priorityA = this.getSourcePriority(a.source);
      const priorityB = this.getSourcePriority(b.source);
      return priorityB - priorityA;
    });

    // Merge steps with conflict resolution
    const mergedSteps = this.mergeSteps(
      sortedSources.map(s => ({ value: s.data.steps, source: s.source, timestamp: s.data.lastUpdated }))
    );

    // Merge heart rate data
    const mergedHeartRate = this.mergeHeartRate(
      sortedSources.flatMap(s => 
        s.data.heartRateData.map(hr => ({
          ...hr,
          source: s.source,
          confidence: this.getSourceReliability(s.source)
        }))
      )
    );

    // Merge sleep data
    const mergedSleep = this.mergeSleepData(
      sortedSources.map(s => ({ ...s.data.sleepData, source: s.source }))
    );

    const avgHeartRate = mergedHeartRate.length > 0
      ? Math.round(mergedHeartRate.reduce((sum, r) => sum + r.value, 0) / mergedHeartRate.length)
      : 0;

    return {
      steps: mergedSteps,
      heartRate: avgHeartRate,
      heartRateData: mergedHeartRate,
      sleepData: mergedSleep,
      lastUpdated: new Date().toISOString(),
    };
  }

  private mergeSteps(stepData: Array<{ value: number; source: string; timestamp: string }>): number {
    if (stepData.length === 0) return 0;
    if (stepData.length === 1) return stepData[0].value;

    // Strategy: Use the highest quality source, but check for significant discrepancies
    const primarySource = stepData[0];
    const secondarySources = stepData.slice(1);

    // Check if secondary sources have significantly different values
    // If they differ by more than 20%, they might be measuring different things
    const avgSecondary = secondarySources.reduce((sum, s) => sum + s.value, 0) / secondarySources.length;
    const difference = Math.abs(primarySource.value - avgSecondary) / primarySource.value;

    if (difference > 0.2) {
      // Significant discrepancy - flag for review but still use primary source
      console.warn('Significant step count discrepancy detected:', {
        primary: primarySource.value,
        secondary: avgSecondary,
        sources: stepData.map(s => ({ source: s.source, value: s.value })),
      });
    }

    // For steps, we generally want to avoid double-counting
    // If multiple sources are similar, use the most reliable one
    // If they're different, it might be different measurement periods
    return this.resolveConflict(stepData.map(d => ({
      value: d.value,
      source: d.source,
      timestamp: d.timestamp,
      confidence: this.getSourceReliability(d.source),
    })));
  }

  private mergeHeartRate(readings: Array<HeartRateReading & { source: string; confidence: number }>): HeartRateReading[] {
    if (readings.length === 0) return [];

    // Group readings by timestamp (within 5-minute windows)
    const groupedReadings = this.groupByTimeWindow(readings, 5 * 60 * 1000);

    // For each time window, select the most reliable reading
    const mergedReadings = Object.values(groupedReadings).map(group => {
      // Sort by confidence (reliability * priority)
      const sorted = group.sort((a, b) => b.confidence - a.confidence);
      const bestReading = sorted[0];

      // If multiple readings in same window, average them weighted by confidence
      if (group.length > 1) {
        const totalConfidence = group.reduce((sum, r) => sum + r.confidence, 0);
        const weightedValue = group.reduce((sum, r) => sum + r.value * r.confidence, 0) / totalConfidence;
        
        return {
          timestamp: bestReading.timestamp,
          value: Math.round(weightedValue),
        };
      }

      return {
        timestamp: bestReading.timestamp,
        value: bestReading.value,
      };
    });

    // Sort by timestamp
    return mergedReadings.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  private mergeSleepData(sleepData: Array<SleepData & { source: string }>): SleepData {
    if (sleepData.length === 0) {
      return {
        totalMinutes: 0,
        deepMinutes: 0,
        lightMinutes: 0,
        remMinutes: 0,
        awakeMinutes: 0,
        score: 0,
      };
    }

    if (sleepData.length === 1) {
      return {
        totalMinutes: sleepData[0].totalMinutes,
        deepMinutes: sleepData[0].deepMinutes,
        lightMinutes: sleepData[0].lightMinutes,
        remMinutes: sleepData[0].remMinutes,
        awakeMinutes: sleepData[0].awakeMinutes,
        score: sleepData[0].score,
      };
    }

    // For sleep, use the most reliable source (usually wearables are better than phones)
    const sortedByReliability = sleepData.sort((a, b) => {
      const reliabilityA = this.getSourceReliability(a.source);
      const reliabilityB = this.getSourceReliability(b.source);
      return reliabilityB - reliabilityA;
    });

    const bestSource = sortedByReliability[0];

    // Check for significant discrepancies
    const avgTotal = sortedByReliability.reduce((sum, s) => sum + s.totalMinutes, 0) / sortedByReliability.length;
    const difference = Math.abs(bestSource.totalMinutes - avgTotal) / bestSource.totalMinutes;

    if (difference > 0.3) {
      console.warn('Significant sleep data discrepancy detected:', {
        primary: bestSource.totalMinutes,
        average: avgTotal,
        sources: sleepData.map(s => ({ source: s.source, total: s.totalMinutes })),
      });
    }

    return {
      totalMinutes: bestSource.totalMinutes,
      deepMinutes: bestSource.deepMinutes,
      lightMinutes: bestSource.lightMinutes,
      remMinutes: bestSource.remMinutes,
      awakeMinutes: bestSource.awakeMinutes,
      score: bestSource.score,
    };
  }

  private groupByTimeWindow<T extends { timestamp: string }>(
    items: T[],
    windowMs: number
  ): Record<string, T[]> {
    const groups: Record<string, T[]> = {};

    items.forEach(item => {
      const time = new Date(item.timestamp).getTime();
      const windowStart = Math.floor(time / windowMs) * windowMs;
      const key = windowStart.toString();

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });

    return groups;
  }

  private resolveConflict(dataPoints: DataPoint[]): number {
    if (dataPoints.length === 0) return 0;
    if (dataPoints.length === 1) return dataPoints[0].value;

    // Strategy: Weighted average based on confidence
    const totalConfidence = dataPoints.reduce((sum, d) => sum + d.confidence, 0);
    const weightedValue = dataPoints.reduce((sum, d) => sum + d.value * d.confidence, 0) / totalConfidence;

    return Math.round(weightedValue);
  }

  private getSourcePriority(sourceId: string): number {
    const source = this.sources.find(s => s.id === sourceId);
    return source?.priority || 50;
  }

  private getSourceReliability(sourceId: string): number {
    const source = this.sources.find(s => s.id === sourceId);
    return source?.reliability || 0.5;
  }

  private createEmptyHealthData(): HealthData {
    return {
      steps: 0,
      heartRate: 0,
      heartRateData: [],
      sleepData: {
        totalMinutes: 0,
        deepMinutes: 0,
        lightMinutes: 0,
        remMinutes: 0,
        awakeMinutes: 0,
        score: 0,
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  // Detect and flag potential data quality issues
  validateData(data: HealthData, source: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check for unrealistic values
    if (data.steps > 100000) {
      issues.push(`Unusually high step count: ${data.steps}`);
    }

    if (data.heartRate > 220 || (data.heartRate > 0 && data.heartRate < 30)) {
      issues.push(`Suspicious heart rate: ${data.heartRate} bpm`);
    }

    if (data.sleepData.totalMinutes > 900) { // More than 15 hours
      issues.push(`Unusually long sleep: ${Math.floor(data.sleepData.totalMinutes / 60)} hours`);
    }

    if (data.sleepData.totalMinutes > 0 && data.sleepData.totalMinutes < 120) { // Less than 2 hours
      issues.push(`Unusually short sleep: ${Math.floor(data.sleepData.totalMinutes / 60)} hours`);
    }

    // Check for missing data
    if (data.sleepData.totalMinutes > 0) {
      const stageTotal = data.sleepData.deepMinutes + data.sleepData.lightMinutes + 
                        data.sleepData.remMinutes + data.sleepData.awakeMinutes;
      if (Math.abs(stageTotal - data.sleepData.totalMinutes) > 30) {
        issues.push('Sleep stage totals don\'t match total sleep time');
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}

export const deduplicationEngine = new DeduplicationEngine();
export default deduplicationEngine;

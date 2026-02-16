import { ExtendedHealthData, BodyRegionData, BodyRegion, HealthStatus, RegionMetric, HealthData } from '../types';

interface ScoreWeights {
  cardiovascular: number;
  respiratory: number;
  musculoskeletal: number;
  nervous: number;
  digestive: number;
  endocrine: number;
  immune: number;
  general: number;
}

const DEFAULT_WEIGHTS: ScoreWeights = {
  cardiovascular: 0.20,
  respiratory: 0.15,
  musculoskeletal: 0.15,
  nervous: 0.15,
  digestive: 0.10,
  endocrine: 0.10,
  immune: 0.10,
  general: 0.05,
};

export const calculateMetricStatus = (
  value: number,
  range: { min: number; max: number; optimal: number }
): HealthStatus => {
  if (value >= range.optimal * 0.9 && value <= range.optimal * 1.1) {
    return 'good';
  }
  if (value >= range.min && value <= range.max) {
    return 'warning';
  }
  return 'alert';
};

export const calculateMetricScore = (
  value: number,
  range: { min: number; max: number; optimal: number }
): number => {
  const optimalDistance = Math.abs(value - range.optimal);
  const acceptableRange = (range.max - range.min) / 2;
  
  if (optimalDistance <= acceptableRange * 0.25) {
    return 100;
  }
  if (optimalDistance <= acceptableRange * 0.5) {
    return 85;
  }
  if (optimalDistance <= acceptableRange * 0.75) {
    return 70;
  }
  if (optimalDistance <= acceptableRange) {
    return 55;
  }
  return Math.max(0, 40 - optimalDistance);
};

const CARDIOVASCULAR_METRICS: RegionMetric[] = [
  {
    key: 'heartRate',
    label: 'Heart Rate',
    value: 0,
    unit: 'bpm',
    status: 'good',
    score: 0,
    range: { min: 50, max: 100, optimal: 70 },
  },
  {
    key: 'hrv',
    label: 'Heart Rate Variability',
    value: 0,
    unit: 'ms',
    status: 'good',
    score: 0,
    range: { min: 20, max: 70, optimal: 50 },
  },
  {
    key: 'bloodPressure',
    label: 'Blood Pressure',
    value: 0,
    unit: 'mmHg',
    status: 'good',
    score: 0,
    range: { min: 90, max: 120, optimal: 110 },
  },
];

const RESPIRATORY_METRICS: RegionMetric[] = [
  {
    key: 'respiratoryRate',
    label: 'Respiratory Rate',
    value: 0,
    unit: 'br/min',
    status: 'good',
    score: 0,
    range: { min: 12, max: 20, optimal: 16 },
  },
  {
    key: 'spo2',
    label: 'Blood Oxygen (SpO2)',
    value: 0,
    unit: '%',
    status: 'good',
    score: 0,
    range: { min: 95, max: 100, optimal: 98 },
  },
];

const MUSCULOSKELETAL_METRICS: RegionMetric[] = [
  {
    key: 'steps',
    label: 'Daily Steps',
    value: 0,
    unit: 'steps',
    status: 'good',
    score: 0,
    range: { min: 3000, max: 15000, optimal: 10000 },
  },
];

const NERVOUS_METRICS: RegionMetric[] = [
  {
    key: 'stressLevel',
    label: 'Stress Level',
    value: 0,
    unit: 'score',
    status: 'good',
    score: 0,
    range: { min: 0, max: 100, optimal: 30 },
  },
  {
    key: 'sleepScore',
    label: 'Sleep Quality',
    value: 0,
    unit: 'score',
    status: 'good',
    score: 0,
    range: { min: 0, max: 100, optimal: 85 },
  },
];

const DIGESTIVE_METRICS: RegionMetric[] = [
  {
    key: 'calories',
    label: 'Calories Burned',
    value: 0,
    unit: 'kcal',
    status: 'good',
    score: 0,
    range: { min: 1500, max: 3500, optimal: 2200 },
  },
];

const ENDOCRINE_METRICS: RegionMetric[] = [
  {
    key: 'bodyTemperature',
    label: 'Body Temperature',
    value: 0,
    unit: '°F',
    status: 'good',
    score: 0,
    range: { min: 97.0, max: 99.5, optimal: 98.6 },
  },
];

const IMMUNE_METRICS: RegionMetric[] = [
  {
    key: 'recoveryScore',
    label: 'Recovery Score',
    value: 0,
    unit: 'score',
    status: 'good',
    score: 0,
    range: { min: 0, max: 100, optimal: 80 },
  },
];

const GENERAL_METRICS: RegionMetric[] = [
  {
    key: 'sleepDuration',
    label: 'Sleep Duration',
    value: 0,
    unit: 'hours',
    status: 'good',
    score: 0,
    range: { min: 5, max: 10, optimal: 8 },
  },
];

export const createBodyRegionData = (healthData: ExtendedHealthData): BodyRegionData[] => {
  const metricsByRegion: Record<BodyRegion, RegionMetric[]> = {
    cardiovascular: CARDIOVASCULAR_METRICS.map(m => {
      let value = 0;
      if (m.key === 'heartRate') value = healthData.heartRate;
      if (m.key === 'hrv') value = healthData.hrv;
      if (m.key === 'bloodPressure' && healthData.bloodPressure) {
        value = healthData.bloodPressure.systolic;
      }
      const range = m.range;
      const status = calculateMetricStatus(value, range);
      const score = calculateMetricScore(value, range);
      return { ...m, value, status, score };
    }),
    respiratory: RESPIRATORY_METRICS.map(m => {
      let value = 0;
      if (m.key === 'respiratoryRate') value = healthData.respiratoryRate;
      if (m.key === 'spo2') value = healthData.spo2;
      const range = m.range;
      const status = calculateMetricStatus(value, range);
      const score = calculateMetricScore(value, range);
      return { ...m, value, status, score };
    }),
    musculoskeletal: MUSCULOSKELETAL_METRICS.map(m => {
      let value = 0;
      if (m.key === 'steps') value = healthData.steps;
      const range = m.range;
      const status = calculateMetricStatus(value, range);
      const score = calculateMetricScore(value, range);
      return { ...m, value, status, score };
    }),
    nervous: NERVOUS_METRICS.map(m => {
      let value = 0;
      if (m.key === 'stressLevel') value = healthData.stressLevel;
      if (m.key === 'sleepScore') value = healthData.sleepData.score;
      const range = m.range;
      const status = calculateMetricStatus(value, range);
      const score = calculateMetricScore(value, range);
      return { ...m, value, status, score };
    }),
    digestive: DIGESTIVE_METRICS.map(m => {
      let value = 0;
      if (m.key === 'calories') value = healthData.steps * 0.04;
      const range = m.range;
      const status = calculateMetricStatus(value, range);
      const score = calculateMetricScore(value, range);
      return { ...m, value, status, score };
    }),
    endocrine: ENDOCRINE_METRICS.map(m => {
      let value = 0;
      if (m.key === 'bodyTemperature') value = healthData.bodyTemperature;
      const range = m.range;
      const status = calculateMetricStatus(value, range);
      const score = calculateMetricScore(value, range);
      return { ...m, value, status, score };
    }),
    immune: IMMUNE_METRICS.map(m => {
      let value = 0;
      if (m.key === 'recoveryScore') {
        value = Math.min(100, Math.max(0, 100 - healthData.stressLevel + healthData.sleepData.score / 2));
      }
      const range = m.range;
      const status = calculateMetricStatus(value, range);
      const score = calculateMetricScore(value, range);
      return { ...m, value, status, score };
    }),
    general: GENERAL_METRICS.map(m => {
      let value = 0;
      if (m.key === 'sleepDuration') value = healthData.sleepData.totalMinutes / 60;
      const range = m.range;
      const status = calculateMetricStatus(value, range);
      const score = calculateMetricScore(value, range);
      return { ...m, value, status, score };
    }),
  };

  const regionNames: Record<BodyRegion, string> = {
    cardiovascular: 'Cardiovascular',
    respiratory: 'Respiratory',
    musculoskeletal: 'Musculoskeletal',
    nervous: 'Nervous',
    digestive: 'Digestive',
    endocrine: 'Endocrine',
    immune: 'Immune',
    general: 'General',
  };

  const regions: BodyRegion[] = [
    'cardiovascular',
    'respiratory',
    'musculoskeletal',
    'nervous',
    'digestive',
    'endocrine',
    'immune',
    'general',
  ];

  return regions.map(region => {
    const metrics = metricsByRegion[region];
    const avgScore = metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length;
    const statusCounts = metrics.reduce(
      (acc, m) => {
        acc[m.status]++;
        return acc;
      },
      { good: 0, warning: 0, alert: 0 }
    );

    let status: HealthStatus = 'good';
    if (statusCounts.alert > 0) status = 'alert';
    else if (statusCounts.warning > 0) status = 'warning';

    return {
      region,
      name: regionNames[region],
      status,
      score: Math.round(avgScore),
      metrics,
    };
  });
};

export const calculateOverallHealthScore = (bodyRegionData: BodyRegionData[]): number => {
  let weightedSum = 0;
  let totalWeight = 0;

  bodyRegionData.forEach(region => {
    const weight = DEFAULT_WEIGHTS[region.region] || 0.1;
    weightedSum += region.score * weight;
    totalWeight += weight;
  });

  return Math.round(weightedSum / totalWeight);
};

export const getStatusColor = (status: HealthStatus): string => {
  switch (status) {
    case 'good':
      return '#10B981';
    case 'warning':
      return '#F59E0B';
    case 'alert':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

export const getHealthScoreLabel = (score: number): { label: string; color: string } => {
  if (score >= 80) return { label: 'Excellent', color: '#10B981' };
  if (score >= 60) return { label: 'Good', color: '#3B82F6' };
  if (score >= 40) return { label: 'Fair', color: '#F59E0B' };
  return { label: 'Needs Attention', color: '#EF4444' };
};

export const createExtendedHealthData = (healthData: HealthData): ExtendedHealthData => {
  const mockExtendedData: ExtendedHealthData = {
    ...healthData,
    spo2: Math.floor(Math.random() * (100 - 95 + 1)) + 95,
    stressLevel: Math.floor(Math.random() * 60 + 10),
    hrv: Math.floor(Math.random() * 40 + 30),
    respiratoryRate: Math.floor(Math.random() * (20 - 12 + 1)) + 12,
    bodyTemperature: 97.5 + Math.random() * 2,
    bloodPressure: {
      systolic: Math.floor(Math.random() * (130 - 100 + 1)) + 100,
      diastolic: Math.floor(Math.random() * (85 - 60 + 1)) + 60,
    },
    bodyRegionData: [],
    overallHealthScore: 0,
  };

  const bodyRegionData = createBodyRegionData(mockExtendedData);
  const overallHealthScore = calculateOverallHealthScore(bodyRegionData);

  return {
    ...mockExtendedData,
    bodyRegionData,
    overallHealthScore,
  };
};

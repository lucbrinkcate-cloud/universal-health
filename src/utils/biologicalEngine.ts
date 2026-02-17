import { HeartRateReading, SleepData } from '../types';

// User profile for calculations
interface UserProfile {
  age: number;
  gender: 'male' | 'female';
  weight: number; // kg
  height: number; // cm
  maxHeartRate: number;
  restingHeartRate: number;
}

// VO2 Max calculation methods
export class VO2MaxCalculator {
  /**
   * Calculate VO2 Max using the Firstbeat method (most accurate for wearables)
   * Requires resting HR, max HR, and activity data
   */
  static calculateFirstbeat(
    restingHR: number,
    maxHR: number,
    activityDuration: number, // minutes
    avgHeartRateDuringActivity: number
  ): number {
    // Firstbeat algorithm uses heart rate reserve and activity intensity
    const hrr = maxHR - restingHR;
    const intensity = (avgHeartRateDuringActivity - restingHR) / hrr;
    
    // VO2 max estimation based on intensity and duration
    const vo2max = (maxHR / restingHR) * 15.3 * intensity * Math.log(activityDuration + 1);
    
    return Math.round(vo2max * 10) / 10;
  }

  /**
   * Calculate VO2 Max using the Uth-Sørensen-Overgaard-Pedersen formula
   * Based on resting heart rate and max heart rate
   */
  static calculateUth(
    restingHR: number,
    maxHR: number
  ): number {
    // Formula: VO2max = 15.3 * (HRmax / HRrest)
    const vo2max = 15.3 * (maxHR / restingHR);
    return Math.round(vo2max * 10) / 10;
  }

  /**
   * Calculate VO2 Max using the Rockport Walk Test
   * Suitable for general population without intense exercise
   */
  static calculateRockport(
    weight: number, // kg
    age: number,
    gender: 'male' | 'female',
    walkTime: number, // minutes to walk 1 mile
    heartRate: number // at end of walk
  ): number {
    const genderFactor = gender === 'male' ? 0 : 1;
    
    // Rockport formula: VO2max = 132.853 - (0.0769 × weight) - (0.3877 × age) + (6.315 × gender) - (3.2649 × time) - (0.1565 × HR)
    const vo2max = 132.853 
      - (0.0769 * weight) 
      - (0.3877 * age) 
      + (6.315 * genderFactor) 
      - (3.2649 * walkTime) 
      - (0.1565 * heartRate);
    
    return Math.round(vo2max * 10) / 10;
  }

  /**
   * Calculate VO2 Max using resting heart rate only (simplified)
   */
  static calculateFromRestingHR(
    restingHR: number,
    age: number,
    gender: 'male' | 'female'
  ): number {
    // Estimate max HR using Tanaka formula: 208 - (0.7 × age)
    const maxHR = 208 - (0.7 * age);
    return this.calculateUth(restingHR, maxHR);
  }

  /**
   * Get fitness category based on VO2 Max
   */
  static getFitnessCategory(vo2max: number, age: number, gender: 'male' | 'female'): string {
    // VO2 Max categories by age and gender (ml/kg/min)
    const categories = {
      male: {
        '20-29': { superior: 55, excellent: 50, good: 45, fair: 40, poor: 35 },
        '30-39': { superior: 52, excellent: 47, good: 42, fair: 37, poor: 32 },
        '40-49': { superior: 49, excellent: 44, good: 39, fair: 34, poor: 29 },
        '50-59': { superior: 46, excellent: 41, good: 36, fair: 31, poor: 26 },
        '60+': { superior: 43, excellent: 38, good: 33, fair: 28, poor: 23 },
      },
      female: {
        '20-29': { superior: 50, excellent: 45, good: 40, fair: 35, poor: 30 },
        '30-39': { superior: 47, excellent: 42, good: 37, fair: 32, poor: 27 },
        '40-49': { superior: 44, excellent: 39, good: 34, fair: 29, poor: 24 },
        '50-59': { superior: 41, excellent: 36, good: 31, fair: 26, poor: 21 },
        '60+': { superior: 38, excellent: 33, good: 28, fair: 23, poor: 18 },
      },
    };

    // Determine age bracket
    let ageBracket = '20-29';
    if (age >= 60) ageBracket = '60+';
    else if (age >= 50) ageBracket = '50-59';
    else if (age >= 40) ageBracket = '40-49';
    else if (age >= 30) ageBracket = '30-39';

    const thresholds = categories[gender][ageBracket as keyof typeof categories['male']];

    if (vo2max >= thresholds.superior) return 'Superior';
    if (vo2max >= thresholds.excellent) return 'Excellent';
    if (vo2max >= thresholds.good) return 'Good';
    if (vo2max >= thresholds.fair) return 'Fair';
    if (vo2max >= thresholds.poor) return 'Poor';
    return 'Very Poor';
  }
}

// Heart Rate Variability (HRV) Analysis
export class HRVAnalyzer {
  /**
   * Calculate RMSSD (Root Mean Square of Successive Differences)
   * Primary HRV metric for recovery assessment
   */
  static calculateRMSSD(rrIntervals: number[]): number {
    if (rrIntervals.length < 2) return 0;

    let sumSquaredDiff = 0;
    let count = 0;

    for (let i = 1; i < rrIntervals.length; i++) {
      const diff = rrIntervals[i] - rrIntervals[i - 1];
      sumSquaredDiff += diff * diff;
      count++;
    }

    const rmssd = Math.sqrt(sumSquaredDiff / count);
    return Math.round(rmssd * 10) / 10;
  }

  /**
   * Calculate SDNN (Standard Deviation of NN intervals)
   * Overall HRV metric
   */
  static calculateSDNN(rrIntervals: number[]): number {
    if (rrIntervals.length === 0) return 0;

    const mean = rrIntervals.reduce((sum, val) => sum + val, 0) / rrIntervals.length;
    const squaredDiffs = rrIntervals.map(val => (val - mean) ** 2);
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / rrIntervals.length;
    const sdnn = Math.sqrt(variance);

    return Math.round(sdnn * 10) / 10;
  }

  /**
   * Calculate pNN50 (percentage of successive intervals that differ by more than 50ms)
   * Parasympathetic activity indicator
   */
  static calculatePNN50(rrIntervals: number[]): number {
    if (rrIntervals.length < 2) return 0;

    let count = 0;
    for (let i = 1; i < rrIntervals.length; i++) {
      const diff = Math.abs(rrIntervals[i] - rrIntervals[i - 1]);
      if (diff > 50) count++;
    }

    const pnn50 = (count / (rrIntervals.length - 1)) * 100;
    return Math.round(pnn50 * 10) / 10;
  }

  /**
   * Analyze HRV for recovery assessment
   */
  static analyzeRecovery(hrvData: number[], userProfile: UserProfile): {
    score: number;
    status: 'excellent' | 'good' | 'fair' | 'poor';
    readiness: number;
    recommendation: string;
  } {
    const rmssd = this.calculateRMSSD(hrvData);
    const sdnn = this.calculateSDNN(hrvData);
    const pnn50 = this.calculatePNN50(hrvData);

    // Recovery score based on RMSSD (0-100)
    // Healthy adults typically have RMSSD 20-70ms
    let recoveryScore = Math.min(100, (rmssd / 50) * 100);
    recoveryScore = Math.max(20, recoveryScore); // Minimum score of 20

    // Adjust based on age and fitness level
    const ageFactor = Math.max(0.7, 1 - (userProfile.age - 20) * 0.005);
    recoveryScore = recoveryScore * ageFactor;

    // Determine status
    let status: 'excellent' | 'good' | 'fair' | 'poor';
    if (recoveryScore >= 80) status = 'excellent';
    else if (recoveryScore >= 60) status = 'good';
    else if (recoveryScore >= 40) status = 'fair';
    else status = 'poor';

    // Calculate readiness for activity (0-100)
    const readiness = Math.min(100, recoveryScore * 1.2);

    // Generate recommendation
    let recommendation = '';
    if (status === 'excellent') {
      recommendation = 'Great recovery! You\'re ready for high-intensity training today.';
    } else if (status === 'good') {
      recommendation = 'Good recovery. Moderate to high-intensity activities are fine.';
    } else if (status === 'fair') {
      recommendation = 'Fair recovery. Consider moderate intensity or active recovery.';
    } else {
      recommendation = 'Poor recovery. Prioritize rest and light activity today.';
    }

    return {
      score: Math.round(recoveryScore),
      status,
      readiness: Math.round(readiness),
      recommendation,
    };
  }

  /**
   * Get baseline HRV for a user
   */
  static getBaselineHRV(age: number, gender: 'male' | 'female'): number {
    // Typical RMSSD values by age and gender
    const baselines = {
      male: {
        '18-25': 45,
        '26-35': 40,
        '36-45': 35,
        '46-55': 30,
        '56-65': 25,
        '65+': 20,
      },
      female: {
        '18-25': 50,
        '26-35': 45,
        '36-45': 40,
        '46-55': 35,
        '56-65': 30,
        '65+': 25,
      },
    };

    let ageGroup = '18-25';
    if (age >= 65) ageGroup = '65+';
    else if (age >= 56) ageGroup = '56-65';
    else if (age >= 46) ageGroup = '46-55';
    else if (age >= 36) ageGroup = '36-45';
    else if (age >= 26) ageGroup = '26-35';

    return baselines[gender][ageGroup as keyof typeof baselines['male']];
  }
}

// Advanced Sleep Analysis
export class SleepAnalyzer {
  /**
   * Calculate sleep efficiency
   */
  static calculateEfficiency(sleepData: SleepData): number {
    if (sleepData.totalMinutes === 0) return 0;
    
    // Efficiency = (Total Sleep Time / Time in Bed) * 100
    // Assuming time in bed = total sleep + awake time
    const timeInBed = sleepData.totalMinutes + sleepData.awakeMinutes;
    const efficiency = (sleepData.totalMinutes / timeInBed) * 100;
    
    return Math.round(efficiency * 10) / 10;
  }

  /**
   * Calculate sleep architecture (ideal percentages)
   */
  static analyzeSleepArchitecture(sleepData: SleepData): {
    deepPercentage: number;
    lightPercentage: number;
    remPercentage: number;
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    recommendations: string[];
  } {
    const total = sleepData.totalMinutes;
    if (total === 0) {
      return {
        deepPercentage: 0,
        lightPercentage: 0,
        remPercentage: 0,
        quality: 'poor',
        recommendations: ['No sleep data available'],
      };
    }

    const deepPercentage = (sleepData.deepMinutes / total) * 100;
    const lightPercentage = (sleepData.lightMinutes / total) * 100;
    const remPercentage = (sleepData.remMinutes / total) * 100;

    // Ideal ranges:
    // Deep: 15-20%
    // Light: 45-55%
    // REM: 20-25%

    const recommendations: string[] = [];

    if (deepPercentage < 15) {
      recommendations.push('Try to increase deep sleep: maintain a cool room temperature and avoid alcohol before bed.');
    }
    if (remPercentage < 20) {
      recommendations.push('Low REM sleep: try to get more total sleep and maintain a consistent sleep schedule.');
    }
    if (lightPercentage > 60) {
      recommendations.push('High light sleep: this may indicate frequent disruptions. Try to minimize noise and light.');
    }

    // Quality assessment
    let quality: 'excellent' | 'good' | 'fair' | 'poor';
    const efficiency = this.calculateEfficiency(sleepData);
    
    if (efficiency >= 90 && deepPercentage >= 15 && remPercentage >= 20) {
      quality = 'excellent';
    } else if (efficiency >= 85 && deepPercentage >= 12 && remPercentage >= 18) {
      quality = 'good';
    } else if (efficiency >= 80) {
      quality = 'fair';
    } else {
      quality = 'poor';
    }

    if (recommendations.length === 0) {
      recommendations.push('Great sleep architecture! Keep up your current sleep habits.');
    }

    return {
      deepPercentage: Math.round(deepPercentage * 10) / 10,
      lightPercentage: Math.round(lightPercentage * 10) / 10,
      remPercentage: Math.round(remPercentage * 10) / 10,
      quality,
      recommendations,
    };
  }

  /**
   * Calculate sleep debt over multiple nights
   */
  static calculateSleepDebt(sleepSessions: SleepData[], targetHours: number = 8): {
    totalDebtMinutes: number;
    averageSleepHours: number;
    daysWithDebt: number;
    status: 'caught-up' | 'mild-debt' | 'moderate-debt' | 'severe-debt';
  } {
    const targetMinutes = targetHours * 60;
    let totalDebt = 0;
    let daysWithDebt = 0;
    let totalSleep = 0;

    sleepSessions.forEach(session => {
      const sessionDebt = Math.max(0, targetMinutes - session.totalMinutes);
      if (sessionDebt > 0) daysWithDebt++;
      totalDebt += sessionDebt;
      totalSleep += session.totalMinutes;
    });

    const averageSleepHours = sleepSessions.length > 0 
      ? (totalSleep / sleepSessions.length) / 60 
      : 0;

    let status: 'caught-up' | 'mild-debt' | 'moderate-debt' | 'severe-debt';
    const debtHours = totalDebt / 60;

    if (debtHours === 0) status = 'caught-up';
    else if (debtHours < 2) status = 'mild-debt';
    else if (debtHours < 5) status = 'moderate-debt';
    else status = 'severe-debt';

    return {
      totalDebtMinutes: totalDebt,
      averageSleepHours: Math.round(averageSleepHours * 10) / 10,
      daysWithDebt,
      status,
    };
  }

  /**
   * Predict optimal bedtime based on sleep patterns
   */
  static predictOptimalBedtime(
    wakeTime: string, // "07:00"
    targetSleepHours: number = 8
  ): string {
    // Account for time to fall asleep (15-20 minutes) and wake-up time
    const sleepDurationMinutes = targetSleepHours * 60 + 20;
    
    const [wakeHours, wakeMinutes] = wakeTime.split(':').map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(wakeHours, wakeMinutes, 0, 0);
    
    const bedtime = new Date(wakeDate.getTime() - sleepDurationMinutes * 60000);
    
    const hours = bedtime.getHours().toString().padStart(2, '0');
    const minutes = bedtime.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }
}

// Export all calculators
export const biologicalEngine = {
  VO2MaxCalculator,
  HRVAnalyzer,
  SleepAnalyzer,
};

export default biologicalEngine;

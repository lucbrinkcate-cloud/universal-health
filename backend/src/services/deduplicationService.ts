import { HealthData, HeartRateReading, StravaActivity } from "../types";

export interface DataPoint {
  source: "native" | "strava";
  type: "steps" | "heart_rate" | "workout";
  value: number;
  timestamp: string;
  priority: number;
}

export class DeduplicationService {
  // Priority levels based on the PDF
  private static PRIORITY = {
    MANUAL: 1,
    ACTIVE_RECORDING: 2, // Strava/Workout mode
    DEDICATED_WEARABLE: 3,
    PHONE_SENSOR: 4
  };

  /**
   * Merges data from multiple sources. Divide the 24-hour day into 1-minute buckets.
   */
  static mergeData(nativeData: HealthData, stravaActivities: StravaActivity[]): HealthData {
    // 1440 minutes in a day
    const buckets: Record<number, DataPoint[]> = {};

    // Ingest Native Heart Rate data
    nativeData.heartRateData.forEach(reading => {
      const minuteBucket = this.getMinuteBucket(new Date(reading.timestamp));
      if (!buckets[minuteBucket]) buckets[minuteBucket] = [];
      buckets[minuteBucket].push({
        source: "native",
        type: "heart_rate",
        value: reading.value,
        timestamp: reading.timestamp,
        priority: this.PRIORITY.DEDICATED_WEARABLE
      });
    });

    // Ingest Strava Activities
    stravaActivities.forEach(activity => {
      const start = new Date(activity.start_date);
      const durationSec = activity.elapsed_time;
      const avgHR = activity.average_heartrate || 0;

      // Fill buckets for the duration of the workout
      for (let i = 0; i < durationSec / 60; i++) {
        const timestamp = new Date(start.getTime() + i * 60000);
        const minuteBucket = this.getMinuteBucket(timestamp);
        if (!buckets[minuteBucket]) buckets[minuteBucket] = [];
        buckets[minuteBucket].push({
          source: "strava",
          type: "workout",
          value: avgHR,
          timestamp: timestamp.toISOString(),
          priority: this.PRIORITY.ACTIVE_RECORDING
        });
      }
    });

    // Merge and Resolve Conflicts
    const mergedHR: HeartRateReading[] = [];
    for (let i = 0; i < 1440; i++) {
      if (buckets[i]) {
        // Find highest priority data point for this minute
        const winner = buckets[i].reduce((prev, current) => 
          current.priority < prev.priority ? current : prev
        );
        mergedHR.push({
          timestamp: winner.timestamp,
          value: winner.value
        });
      }
    }

    return {
      ...nativeData,
      heartRateData: mergedHR,
      heartRate: mergedHR.length > 0 
        ? Math.round(mergedHR.reduce((sum, r) => sum + r.value, 0) / mergedHR.length)
        : nativeData.heartRate,
      lastUpdated: new Date().toISOString()
    };
  }

  private static getMinuteBucket(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
  }
}
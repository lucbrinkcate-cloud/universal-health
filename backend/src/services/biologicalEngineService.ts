import { StravaActivity } from "../types";

export class BiologicalEngineService {
  /**
   * MET values for common activities
   * Simplified for the prototype
   */
  private static MET_VALUES: Record<string, number> = {
    "Run": 10.0,
    "Ride": 8.0,
    "Swim": 7.0,
    "Walk": 3.5,
    "Yoga": 3.0,
    "WeightTraining": 5.0,
    "Workout": 6.0,
    "Hike": 6.0,
    "AlpineSki": 7.0,
    "BackcountrySki": 8.0,
    "Canoeing": 3.5,
    "Crossfit": 8.0,
    "EBikeRide": 4.5,
    "Elliptical": 5.0,
    "Golf": 4.5,
    "Handcycle": 8.0,
    "IceSkate": 7.0,
    "InlineSkate": 7.0,
    "Kayaking": 5.0,
    "Kitesurf": 10.0,
    "NordicSki": 8.0,
    "RockClimbing": 8.0,
    "RollerSki": 8.0,
    "Rowing": 7.0,
    "Sail": 3.0,
    "Skateboard": 5.0,
    "Snowboard": 7.0,
    "Snowshoe": 8.0,
    "Soccer": 7.0,
    "StairStepper": 6.0,
    "StandUpPaddling": 4.0,
    "Surfing": 3.0,
    "TrailRun": 10.0,
    "Velomobile": 8.0,
    "VirtualRide": 8.0,
    "VirtualRun": 10.0,
    "Wheelchair": 3.5,
    "Windsurf": 5.0
  };

  /**
   * Calculates XP based on activity duration and type (MET-Hours).
   * Formula: XP = MET * Duration_hours * 100
   */
  static calculateXP(activity: StravaActivity): number {
    const met = this.MET_VALUES[activity.sport_type] || this.MET_VALUES[activity.type] || 5.0;
    const durationHours = activity.moving_time / 3600;
    
    // Base XP
    let xp = Math.round(met * durationHours * 100);

    // Heart Rate Multiplier (Pillar 3: XP normalized by effort)
    if (activity.has_heartrate && activity.average_heartrate) {
      // Simple multiplier based on effort intensity
      // Assuming max heart rate is around 180 for normalized XP
      const intensity = activity.average_heartrate / 180;
      if (intensity > 0.8) xp = Math.round(xp * 1.2); // High intensity bonus
      if (intensity < 0.6) xp = Math.round(xp * 0.8); // Low intensity penalty
    }

    return xp;
  }

  /**
   * Calculates Readiness Score (Pillar 2)
   * Simplified for prototype: composite of HRV, Sleep, and RHR
   */
  static calculateReadiness(hrv: number, sleepScore: number, rhr: number): number {
    // Weighted components: Sleep (40%), HRV (40%), RHR (20%)
    // This mirrors the Oura methodology mentioned in the PDF
    
    // Normalize HRV (assuming 0-100 range)
    const hrvScore = Math.min(Math.max(hrv, 0), 100);
    
    // Normalize RHR (assuming lower is better, target around 50)
    const rhrScore = Math.max(0, 100 - (rhr - 40) * 2);

    return Math.round(
      (sleepScore * 0.4) + 
      (hrvScore * 0.4) + 
      (rhrScore * 0.2)
    );
  }
}
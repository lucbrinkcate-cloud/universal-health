import axios from "axios";
import { STRAVA_CONFIG } from "../constants";
import { HealthData, HeartRateReading, SleepData } from "../types";

// Strava Service for fetching activity and biometrics
class StravaService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  async getActivities(before?: number, after?: number): Promise<any[]> {
    if (!this.accessToken) throw new Error("Strava not connected");
    
    try {
      const response = await axios.get("https://www.strava.com/api/v3/athlete/activities", {
        headers: { Authorization: `Bearer ${this.accessToken}` },
        params: { before, after }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch Strava activities:", error);
      throw error;
    }
  }

  // Strava doesn't provide sleep data directly, but we can get it from other sources
  // or use activities to infer physical state.
  
  async getAthleteStats(id: string): Promise<any> {
    if (!this.accessToken) throw new Error("Strava not connected");
    
    try {
      const response = await axios.get(`https://www.strava.com/api/v3/athletes/${id}/stats`, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch Strava athlete stats:", error);
      throw error;
    }
  }
}

export const stravaService = new StravaService();
export default stravaService;
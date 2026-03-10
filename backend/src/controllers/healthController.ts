import { Request, Response } from "express";
import { DeduplicationService } from "../services/deduplicationService";
import { BiologicalEngineService } from "../services/biologicalEngineService";

export class HealthController {
  static syncData(req: Request, res: Response) {
    try {
      const { nativeData, stravaActivities } = req.body;
      
      if (!nativeData) {
        return res.status(400).json({ error: "nativeData is required" });
      }

      const activities = stravaActivities || [];
      const mergedData = DeduplicationService.mergeData(nativeData, activities);
      
      // Calculate XP for new activities
      const xpGained = activities.reduce((total: number, activity: any) => 
        total + BiologicalEngineService.calculateXP(activity), 0);

      // Calculate Readiness
      // In a real app, we would fetch HRV and RHR from mergedData
      const hrv = 65; // Mock/Example
      const rhr = 58; // Mock/Example
      const readiness = BiologicalEngineService.calculateReadiness(
        hrv, 
        mergedData.sleepData.score, 
        rhr
      );
      
      res.json({
        ...mergedData,
        readiness,
        xpGained
      });
    } catch (error) {
      console.error("Sync error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { AnalyticsService } from "./analytics.service";

export class AnalyticsController {

  static async creatorOverview(req: AuthRequest, res: Response) {
    try {
      const data = await AnalyticsService.getCreatorOverview(req.user.id);
      res.json(data);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async eventAnalytics(req: AuthRequest, res: Response) {
    try {
      const eventId = req.params.eventId;

      const data = await AnalyticsService.getEventAnalytics(String(eventId));

      res.json(data);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
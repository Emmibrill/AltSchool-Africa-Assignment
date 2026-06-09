import { Router } from "express";
import { AnalyticsController } from "./analytics.controller";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/creator",
  authenticate,
  authorizeRole(["CREATOR"]),
  AnalyticsController.creatorOverview
);

router.get(
  "/event/:eventId",
  authenticate,
  authorizeRole(["CREATOR"]),
  AnalyticsController.eventAnalytics
);

export default router;
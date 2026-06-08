import { Router } from "express";
import { AttendanceController } from "./attendance.controller";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

// Only CREATOR or ADMIN can scan tickets at event gate
router.post(
  "/check-in",
  authenticate,
  authorizeRole(["CREATOR", "ADMIN"]),
  AttendanceController.checkIn
);

router.post("/scan", authenticate, AttendanceController.scanQR);

export default router;
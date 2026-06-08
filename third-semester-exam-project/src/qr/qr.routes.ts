import { Router } from "express";
import { QRController } from "./qr.controller";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/generate/:ticketId",
  authenticate,
  authorizeRole(["EVENTEE"]),
  QRController.generate
);

export default router;
import { Router } from "express";
import { ReminderController } from "./reminder.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  ReminderController.create
);

router.get(
  "/",
  authenticate,
  ReminderController.myReminders
);

router.delete(
  "/:id",
  authenticate,
  ReminderController.delete
);

export default router;
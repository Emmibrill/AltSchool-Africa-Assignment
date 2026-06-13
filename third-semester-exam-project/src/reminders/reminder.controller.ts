import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ReminderService } from "./reminder.service";

export class ReminderController {

  static async create(
    req: AuthRequest,
    res: Response
  ) {
    try {

      const reminder =
        await ReminderService.createReminder(
          req.user.id,
          req.body.message,
          new Date(req.body.sendAt)
        );

      res.status(201).json(reminder);

    } catch (err: any) {

      res.status(400).json({
        message: err.message,
      });

    }
  }

  static async myReminders(
    req: AuthRequest,
    res: Response
  ) {
    const reminders =
      await ReminderService.getMyReminders(
        req.user.id
      );

    res.json(reminders);
  }

  static async delete(
    req: AuthRequest,
    res: Response
  ) {
    try {

      await ReminderService.deleteReminder(
        String(req.params.id),
        req.user.id
      );

      res.json({
        message: "Reminder deleted",
      });

    } catch (err: any) {

      res.status(400).json({
        message: err.message,
      });

    }
  }
}
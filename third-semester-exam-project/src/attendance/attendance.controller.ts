import { Request, Response } from "express";
import { AttendanceService } from "./attendance.service";

export class AttendanceController {

  static async checkIn(req: Request, res: Response) {
    try {
      const { ticketId } = req.body;

      const result = await AttendanceService.checkIn(ticketId);

      res.status(200).json({
        message: "Check-in successful",
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
  
static async scanQR(req: Request, res: Response) {
    try {
      const { ticketId } = req.body;

      const attendance = await AttendanceService.checkIn(ticketId);

      res.json({
        message: "Check-in successful",
        attendance,
      });

    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
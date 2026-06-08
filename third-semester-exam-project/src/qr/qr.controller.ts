import { Response } from "express";
import { QRService } from "./qr.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class QRController {

  static async generate(req: AuthRequest, res: Response) {
    try {
     // Ensure ticketId is a string for type safety
      const ticketId = String(req.params.ticketId);

      const qr = await QRService.generateForTicket(ticketId);

      res.status(201).json(qr);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
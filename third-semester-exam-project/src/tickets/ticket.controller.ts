import { Response } from "express";
import { TicketService } from "./ticket.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class TicketController {
  static async purchase(req: AuthRequest, res: Response) {
    try {
      // Ensure eventId is a string for type safety
      const eventId = String(req.params.eventId);

      const ticket = await TicketService.purchaseTicket(
        req.user.id,
        eventId
      );

      res.status(201).json(ticket);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async myTickets(req: AuthRequest, res: Response) {
    try {
      const tickets = await TicketService.getUserTickets(req.user.id);
      res.json(tickets);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
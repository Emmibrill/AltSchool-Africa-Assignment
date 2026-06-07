import { Response } from "express";
import { TicketService } from "./ticket.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class TicketController {
  static async purchase(req: AuthRequest, res: Response) {
    try {
      const ticket = await TicketService.purchaseTicket(
        req.user.id,
        req.params.eventId
      );

      res.status(201).json(ticket);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async myTickets(req: AuthRequest, res: Response) {
    const tickets = await TicketService.getUserTickets(req.user.id);
    res.json(tickets);
  }
}
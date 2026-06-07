import { Response } from "express";
import { EventService } from "./event.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class EventController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const event = await EventService.createEvent(req.body, req.user.id);
      res.status(201).json(event);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAll(req: AuthRequest, res: Response) {
    const events = await EventService.getAllEvents(req.query);
    res.json(events);
  }

  static async getOne(req: AuthRequest, res: Response) {
    const event = await EventService.getEventById(req.params.id);
    res.json(event);
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const event = await EventService.updateEvent(
        req.params.id,
        req.body,
        req.user.id
      );
      res.json(event);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      await EventService.deleteEvent(req.params.id, req.user.id);
      res.json({ message: "Deleted successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async publish(req: AuthRequest, res: Response) {
    try {
      const event = await EventService.publishEvent(
        req.params.id,
        req.user.id
      );
      res.json(event);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}

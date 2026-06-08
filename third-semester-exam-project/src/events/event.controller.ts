import { Response } from "express";
import { EventService } from "./event.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Request } from "express";

// Define a type for the route parameters to ensure type safety
type IdParam = {
  id: string;
};

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
    try {
      const events = await EventService.getAllEvents(req.query);
      res.json(events);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getOne(
    req: Request<IdParam> & AuthRequest,
    res: Response
  ) {
    try {
      const event = await EventService.getEventById(req.params.id);
      res.json(event);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async update(
    req: Request<IdParam> & AuthRequest,
    res: Response
  ) {
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

  static async delete(
    req: Request<IdParam> & AuthRequest,
    res: Response
  ) {
    try {
      await EventService.deleteEvent(req.params.id, req.user.id);
      res.json({ message: "Deleted successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async publish(
    req: Request<IdParam> & AuthRequest,
    res: Response
  ) {
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

  // ✅ FIXED SHARE LINKS (THIS IS THE REAL FIX)
  static async shareLinks(
    req: Request<IdParam>,
    res: Response
  ) {
    try {
      const id = req.params.id; // now fully typed
      const title = String(req.query.title || "Event");

      const baseUrl = process.env.BASE_URL || "http://localhost:5000";

      const eventUrl = `${baseUrl}/events/${id}`;

      res.json({
        eventUrl,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(
          `Check out this event: ${title} - ${eventUrl}`
        )}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `Don't miss this event: ${title}`
        )}&url=${encodeURIComponent(eventUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          eventUrl
        )}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          eventUrl
        )}`,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
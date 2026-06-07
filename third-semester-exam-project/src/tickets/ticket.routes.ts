import { Router } from "express";
import { TicketController } from "./ticket.controller";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/purchase/:eventId",
  authenticate,
  authorizeRole(["EVENTEE"]),
  TicketController.purchase
);

router.get(
  "/my-tickets",
  authenticate,
  authorizeRole(["EVENTEE"]),
  TicketController.myTickets
);

export default router;
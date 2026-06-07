import { prisma } from "../config/prisma";
import { generateTicketNumber } from "./ticket.utils";

export class TicketService {
  static async purchaseTicket(userId: string, eventId: string) {
    return await prisma.$transaction(async (tx) => {
      
      // 1. Get event
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      if (event.status !== "PUBLISHED") {
        throw new Error("Event not available");
      }

      // 2. Check capacity
      if (event.soldCount >= event.capacity) {
        throw new Error("Event is fully booked");
      }

      // 3. Create ticket
      const ticket = await tx.ticket.create({
        data: {
          ticketNo: generateTicketNumber(),
          eventId,
          userId,
        },
      });

      // 4. Increase sold count
      await tx.event.update({
        where: { id: eventId },
        data: {
          soldCount: {
            increment: 1,
          },
        },
      });

      return ticket;
    });
  }

  static async getUserTickets(userId: string) {
    return await prisma.ticket.findMany({
      where: { userId },
      include: {
        event: true,
      },
    });
  }
}
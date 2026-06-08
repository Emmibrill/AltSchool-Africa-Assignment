import { prisma } from "../config/prisma";
import { calculateReminderTime } from "../notifications/notification.utils";
import { generateTicketNumber } from "./ticket.utils";
import { Prisma } from "@prisma/client";

export class TicketService {
  static async purchaseTicket(userId: string, eventId: string) {
    return await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {

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

        // 4. Create reminders (IMPORTANT: use tx, not prisma)
        await tx.reminder.createMany({
          data: [
            {
              userId,
              message: `Your event "${event.title}" starts in 1 week`,
              sendAt: calculateReminderTime(event.startDate, "1w"),
            },
            {
              userId,
              message: `Your event "${event.title}" starts tomorrow`,
              sendAt: calculateReminderTime(event.startDate, "1d"),
            },
            {
              userId,
              message: `Your event "${event.title}" starts in 1 hour`,
              sendAt: calculateReminderTime(event.startDate, "1h"),
            },
          ],
        });

        // 5. Update event sold count
        await tx.event.update({
          where: { id: eventId },
          data: {
            soldCount: {
              increment: 1,
            },
          },
        });

        return ticket;
      }
    );
  }

   static async createTicketFromPayment(userId: string, eventId: string) {
    return await prisma.ticket.create({
      data: {
        ticketNo: generateTicketNumber(),
        userId,
        eventId,
      },
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
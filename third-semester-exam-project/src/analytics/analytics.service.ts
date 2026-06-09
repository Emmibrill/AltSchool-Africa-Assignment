
import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

type EventWithRelations = Prisma.EventGetPayload<{
  include: {
    tickets: true;
    payments: true;
    attendance: true;
  };
}>;

export class AnalyticsService {

  //
  
  static async getCreatorOverview(creatorId: string) {

    const events: EventWithRelations[] = await prisma.event.findMany({
      where: { creatorId },
      include: {
        tickets: true,
        payments: true,
        attendance: true,
      },
    });

    const totalEvents = events.length;

    const totalTickets = events.reduce(
      (sum, e) => sum + (e.tickets?.length ?? 0),
      0
    );

    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "SUCCESS",
        event: {
          creatorId,
        },
      },
    });

    const totalAttendance = events.reduce(
      (sum, e) => sum + (e.attendance?.length ?? 0),
      0
    );

    return {
      totalEvents,
      totalTickets,
      totalRevenue: totalRevenue._sum.amount ?? 0,
      totalAttendance,
    };
  }

  //
  static async getEventAnalytics(eventId: string) {

    const event: EventWithRelations | null = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        tickets: true,
        payments: true,
        attendance: true,
      },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    const ticketsSold = event.tickets.length;

    const revenue = event.payments.reduce(
      (sum, p) => sum + (p.amount ?? 0),
      0
    );

    const attendance = event.attendance.length;

    return {
      eventId,
      ticketsSold,
      revenue,
      attendance,
      capacity: event.capacity,
      remainingSlots: event.capacity - ticketsSold,
    };
  }
}
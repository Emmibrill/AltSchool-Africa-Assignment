import { prisma } from "../config/prisma";
import { cache } from "../config/cache";
import { Prisma } from "@prisma/client";

type EventWithRelations = Prisma.EventGetPayload<{
  include: {
    tickets: true;
    payments: true;
    attendance: true;
  };
}>;

export class AnalyticsService {

  // Creator overview analytics
  static async getCreatorOverview(creatorId: string) {

    const cacheKey = `creator-overview:${creatorId}`;

    const cached = cache.get(cacheKey);

    if (cached) {
      return cached;
    }

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
      (sum, e) => sum + e.tickets.length,
      0
    );

    const totalRevenue = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: "SUCCESS",
        event: {
          creatorId,
        },
      },
    });

    const totalAttendance = events.reduce(
      (sum, e) => sum + e.attendance.length,
      0
    );

    const result = {
      totalEvents,
      totalTickets,
      totalRevenue: totalRevenue._sum.amount ?? 0,
      totalAttendance,
    };

    cache.set(cacheKey, result);

    return result;
  }

  // Event-specific analytics
  static async getEventAnalytics(eventId: string) {

    const cacheKey = `event-analytics:${eventId}`;

    const cached = cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const event: EventWithRelations | null =
      await prisma.event.findUnique({
        where: {
          id: eventId,
        },
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
      (sum, payment) => sum + payment.amount,
      0
    );

    const attendance = event.attendance.length;

    const result = {
      eventId,
      ticketsSold,
      revenue,
      attendance,
      capacity: event.capacity,
      remainingSlots: event.capacity - ticketsSold,
    };

    cache.set(cacheKey, result);

    return result;
  }

  // Optional helper for clearing analytics cache
  static clearAnalyticsCache(eventId?: string) {
    if (eventId) {
      cache.del(`event-analytics:${eventId}`);
    } else {
      cache.flushAll();
    }
  }
}
import { prisma } from "../config/prisma";

export class CreatorPaymentService {

  static async getCreatorPayments(
    creatorId: string
  ) {
    return prisma.payment.findMany({
      where: {
        event: {
          creatorId,
        },
      },
      include: {
        user: true,
        event: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getEventPayments(
    eventId: string,
    creatorId: string
  ) {

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.creatorId !== creatorId) {
      throw new Error("Unauthorized");
    }

    return prisma.payment.findMany({
      where: {
        eventId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
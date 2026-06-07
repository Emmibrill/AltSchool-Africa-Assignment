import { prisma } from "../config/prisma";

export class EventService {
  static async createEvent(data: any, userId: string) {
    return await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        price: data.price,
        capacity: data.capacity,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        creatorId: userId,
      },
    });
  }

  static async getAllEvents(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    return await prisma.event.findMany({
      where: {
        status: "PUBLISHED",
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getEventById(id: string) {
    return await prisma.event.findUnique({
      where: { id },
    });
  }

  static async updateEvent(id: string, data: any, userId: string) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event || event.creatorId !== userId) {
      throw new Error("Not allowed");
    }

    return await prisma.event.update({
      where: { id },
      data,
    });
  }

  static async deleteEvent(id: string, userId: string) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event || event.creatorId !== userId) {
      throw new Error("Not allowed");
    }

    return await prisma.event.delete({
      where: { id },
    });
  }

  static async publishEvent(id: string, userId: string) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event || event.creatorId !== userId) {
      throw new Error("Not allowed");
    }

    return await prisma.event.update({
      where: { id },
      data: { status: "PUBLISHED" },
    });
  }
}
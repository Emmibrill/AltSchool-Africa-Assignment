import { prisma } from "../config/prisma";
import { cache } from "../config/cache";

export class EventService {

  static async createEvent(data: any, userId: string) {

    const event = await prisma.event.create({
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

    // Clear cached event lists
    cache.flushAll();

    return event;
  }

  static async getAllEvents(query: any) {

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const cacheKey = `events:${page}:${limit}`;

    const cachedEvents = cache.get(cacheKey);

    if (cachedEvents) {
      return cachedEvents;
    }

    const events = await prisma.event.findMany({
      where: {
        status: "PUBLISHED",
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    cache.set(cacheKey, events);

    return events;
  }

  static async getEventById(id: string) {

    const cacheKey = `event:${id}`;

    const cachedEvent = cache.get(cacheKey);

    if (cachedEvent) {
      return cachedEvent;
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        tickets: true,
        payments: true,
        attendance: true,
      },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    cache.set(cacheKey, event);

    return event;
  }

  static async updateEvent(id: string, data: any, userId: string) {

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event || event.creatorId !== userId) {
      throw new Error("Not allowed");
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data,
    });

    // Clear stale cache
    cache.del(`event:${id}`);
    cache.flushAll();

    return updatedEvent;
  }

  static async deleteEvent(id: string, userId: string) {

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event || event.creatorId !== userId) {
      throw new Error("Not allowed");
    }

    const deletedEvent = await prisma.event.delete({
      where: { id },
    });

    cache.del(`event:${id}`);
    cache.flushAll();

    return deletedEvent;
  }

  static async publishEvent(id: string, userId: string) {

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event || event.creatorId !== userId) {
      throw new Error("Not allowed");
    }

    const publishedEvent = await prisma.event.update({
      where: { id },
      data: {
        status: "PUBLISHED",
      },
    });

    cache.del(`event:${id}`);
    cache.flushAll();

    return publishedEvent;
  }
}
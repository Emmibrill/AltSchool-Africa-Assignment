import { prisma } from "../config/prisma";

export class AttendanceService {

  static async checkIn(ticketId: string) {

    // 1. Find ticket
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { event: true },
    });

    if (!ticket) {
      throw new Error("Invalid ticket");
    }

    // 2. Check if already used
    if (ticket.status === "USED") {
      throw new Error("Ticket already used");
    }

    // 3. Prevent duplicate attendance
    const existing = await prisma.attendance.findFirst({
      where: { ticketId },
    });

    if (existing) {
      throw new Error("Already checked in");
    }

    // 4. Mark attendance
    const attendance = await prisma.attendance.create({
      data: {
        ticketId,
        eventId: ticket.eventId,
        userId: ticket.userId,
      },
    });

    // 5. Update ticket status
    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: "USED",
      },
    });

    return attendance;
  }
}
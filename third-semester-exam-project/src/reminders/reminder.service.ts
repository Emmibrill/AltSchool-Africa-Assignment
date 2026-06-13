import { prisma } from "../config/prisma";

export class ReminderService {

  static async createReminder(
    userId: string,
    message: string,
    sendAt: Date
  ) {
    return prisma.reminder.create({
      data: {
        userId,
        message,
        sendAt,
      },
    });
  }

  static async getMyReminders(userId: string) {
    return prisma.reminder.findMany({
      where: {
        userId,
      },
      orderBy: {
        sendAt: "asc",
      },
    });
  }

  static async deleteReminder(
    reminderId: string,
    userId: string
  ) {

    const reminder =
      await prisma.reminder.findUnique({
        where: {
          id: reminderId,
        },
      });

    if (!reminder) {
      throw new Error("Reminder not found");
    }

    if (reminder.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return prisma.reminder.delete({
      where: {
        id: reminderId,
      },
    });
  }
}
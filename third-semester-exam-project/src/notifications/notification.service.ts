import { prisma } from "../config/prisma";

export class NotificationService {

  static async createNotification(userId: string, title: string, message: string) {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        message,
      },
    });
  }

  static async getUserNotifications(userId: string) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async markAsRead(notificationId: string) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }
}
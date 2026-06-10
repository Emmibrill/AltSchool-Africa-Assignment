import cron from "node-cron";
import { prisma } from "../config/prisma";
import { NotificationService } from "../notifications/notification.service";


cron.schedule("* * * * *", async () => {

    try {
         const now = new Date();

  const reminders = await prisma.reminder.findMany({
    where: {
      sent: false,
      sendAt: {
        lte: now,
      },
    },
    include: {
      user: true,
    },
  });

  for (const reminder of reminders) {
    await NotificationService.createNotification(
      reminder.userId,
      "Event Reminder",
      reminder.message
    );

    await prisma.reminder.update({
      where: { id: reminder.id },
      data: { sent: true },
    });
  }

  console.log("Reminder job executed:", reminders.length);
    } catch (error) { console.log("Reminder cron job failed", error)  }
 
});
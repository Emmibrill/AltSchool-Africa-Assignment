import { prisma } from "../config/prisma";
import { generateQRCodeImage } from "./qr.utils";

export class QRService {

  static async generateForTicket(ticketId: string) {

    // 1. Check if QR already exists (IMPORTANT FIX)
    const existingQR = await prisma.qRCode.findUnique({
      where: { ticketId },
    });

    if (existingQR) {
      return existingQR;
    }

    // 2. Get ticket
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { event: true },
    });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // 3. Secure QR payload (UNCHANGED but correct)
    const qrData = JSON.stringify({
      ticketId: ticket.id,
      eventId: ticket.eventId,
      userId: ticket.userId,
      ticketNo: ticket.ticketNo,
    });

    // 4. Generate QR image
    const qrImage = await generateQRCodeImage(qrData);

    // 5. Save QR to DB (IMPROVED code field)
    const qrCode = await prisma.qRCode.create({
      data: {
        code: ticket.id,
        imageUrl: qrImage,
        ticketId: ticket.id,
      },
    });

    return qrCode;
  }
}
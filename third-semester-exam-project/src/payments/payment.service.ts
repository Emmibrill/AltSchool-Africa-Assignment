import axios from "axios";
import { prisma } from "../config/prisma";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const BASE_URL = process.env.PAYSTACK_BASE_URL!;

export class PaymentService {
  
  // INITIATE PAYMENT
  static async initializePayment(userId: string, eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    const response = await axios.post(
      `${BASE_URL}/transaction/initialize`,
      {
        email: userId,
        amount: event.price * 100, // Paystack uses kobo
        metadata: {
          userId,
          eventId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    return response.data.data;
  }

  // VERIFY PAYMENT
  static async verifyPayment(reference: string) {
    const response = await axios.get(
      `${BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    return response.data.data;
  }
}
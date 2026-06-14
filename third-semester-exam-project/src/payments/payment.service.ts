import axios from "axios";
import { prisma } from "../config/prisma";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const BASE_URL = process.env.PAYSTACK_BASE_URL!;

export class PaymentService {

// Initialize Payment
static async initializePayment(userId: string, eventId: string) {


const event = await prisma.event.findUnique({
  where: { id: eventId },
});

if (!event) {
  throw new Error("Event not found");
}

const user = await prisma.user.findUnique({
  where: { id: userId },
});

if (!user) {
  throw new Error("User not found");
}

const response = await axios.post(
  `${BASE_URL}/transaction/initialize`,
  {
    email: user.email,
    amount: event.price * 100,

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

const paystackData = response.data.data;

// Save payment record before redirecting user
await prisma.payment.create({
  data: {
    reference: paystackData.reference,
    amount: event.price,
    status: "PENDING",
    userId,
    eventId,
  },
});

return {
  authorizationUrl: paystackData.authorization_url,
  accessCode: paystackData.access_code,
  reference: paystackData.reference,
};


}

// Verify Payment
static async verifyPayment(reference: string) {


const response = await axios.get(
  `${BASE_URL}/transaction/verify/${reference}`,
  {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
    },
  }
);

const paymentData = response.data.data;

if (paymentData.status === "success") {
  await prisma.payment.update({
    where: { reference },
    data: {
      status: "SUCCESS",
    },
  });
}

return paymentData;


}
}

import { Request, Response } from "express";
import crypto from "crypto";

import { PaymentService } from "./payment.service";
import { AuthRequest } from "../middlewares/auth.middleware";

import { prisma } from "../config/prisma";

import { TicketService } from "../tickets/ticket.service";
import { QRService } from "../qr/qr.service";

import { CreatorPaymentService } from "./payment.creator.service";

export class PaymentController {

// Initialize payment
static async initialize(
req: AuthRequest,
res: Response
) {
try {

  const eventId = String(req.body.eventId);

  const payment =
    await PaymentService.initializePayment(
      req.user.id,
      eventId
    );

  res.status(200).json(payment);

} catch (err: any) {

  res.status(400).json({
    message: err.message,
  });

}

}

// Verify payment manually
static async verify(
req: AuthRequest,
res: Response
) {
try {

  const reference =
    String(req.params.reference);

  const payment =
    await PaymentService.verifyPayment(
      reference
    );

  res.status(200).json(payment);

} catch (err: any) {

  res.status(400).json({
    message: err.message,
  });

}

}

// Paystack Webhook
static async paystackWebhook(
req: Request,
res: Response
) {
try {

  const secret =
    process.env.PAYSTACK_SECRET_KEY!;

  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  const signature =
    req.headers["x-paystack-signature"];

  if (hash !== signature) {
    return res.status(401).json({
      message: "Invalid signature",
    });
  }

  const event = req.body;

  // Only handle successful charges
  if (event.event === "charge.success") {

    const reference =
      event.data.reference;

    const payment =
      await prisma.payment.findUnique({
        where: { reference },
      });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // Prevent duplicate processing
    if (payment.status === "SUCCESS") {
      return res.status(200).json({
        message: "Already processed",
      });
    }

    // Mark payment successful
    await prisma.payment.update({
      where: { reference },
      data: {
        status: "SUCCESS",
      },
    });

    // Create ticket automatically
    const ticket =
      await TicketService.createTicketFromPayment(
        payment.userId,
        payment.eventId
      );

    // Generate QR automatically
    await QRService.generateForTicket(
      ticket.id
    );
  }

  return res.status(200).json({
    message: "Webhook received",
  });

} catch (err: any) {

  console.error(
    "Webhook error:",
    err
  );

  return res.status(500).json({
    message: "Webhook failed",
  });
}

}

// Creator payment dashboard
static async creatorPayments(
req: AuthRequest,
res: Response
) {
try {

  const payments =
    await CreatorPaymentService.getCreatorPayments(
      req.user.id
    );

  res.status(200).json(payments);

} catch (err: any) {

  res.status(400).json({
    message: err.message,
  });

}

}

// Event-specific payments
static async eventPayments(
req: AuthRequest,
res: Response
) {
try {

  const eventId =
    String(req.params.eventId);

  const payments =
    await CreatorPaymentService.getEventPayments(
      eventId,
      req.user.id
    );

  res.status(200).json(payments);

} catch (err: any) {

  res.status(400).json({
    message: err.message,
  });

}

}
}

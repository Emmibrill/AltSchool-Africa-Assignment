import { Router } from "express";
import { PaymentController } from "./payment.controller";
import {
  authenticate,
  authorizeRole,
} from "../middlewares/auth.middleware";

import {
  validateBody,
  validateParams,
} from "../middlewares/validate.middleware";

import {
  initializePaymentSchema,
  verifyPaymentParamsSchema,
} from "../validations/payment.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: Payment and ticket purchase endpoints
 */

/**
 * @swagger
 * /api/payments/initialize:
 *   post:
 *     summary: Initialize payment for an event ticket
 *     tags:
 *       - Payments
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: 685f4b9f4c8c2f1d9a123456
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only event attendees can initialize payments
 */


// Initialize Payment
router.post(
  "/initialize",
  authenticate,
  authorizeRole(["EVENTEE"]),
  validateBody(initializePaymentSchema),
  PaymentController.initialize,
  
);


/**
 * @swagger
 * /api/payments/creator:
 *   get:
 *     summary: Get all payments received by the authenticated creator
 *     tags:
 *       - Payments
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only creators can access payment records
 */

router.get("/creator", authenticate, authorizeRole(["CREATOR"]), PaymentController.creatorPayments);

/**
 * @swagger
 * /api/payments/verify/{reference}:
 *   get:
 *     summary: Verify a payment transaction
 *     tags:
 *       - Payments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Paystack transaction reference
 *         example: PSK_1234567890
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Invalid payment reference
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */

router.get(
  "/verify/:reference",
  authenticate,
  authorizeRole(["EVENTEE"]),
  validateParams(verifyPaymentParamsSchema),
  PaymentController.verify
);


/**
 * @swagger
 * /api/payments/event/{eventId}:
 *   get:
 *     summary: Get all payments made for a specific event
 *     tags:
 *       - Payments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event payments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only creators can access event payment records
 *       404:
 *         description: Event not found
 */

router.get(
  "/event/:eventId",
  authenticate,
  authorizeRole(["CREATOR"]),
  PaymentController.eventPayments
);

/**
 * @swagger
 * /api/payments/webhook/paystack:
 *   post:
 *     summary: Paystack webhook endpoint
 *     tags:
 *       - Payments
 *     description: Receives payment event notifications from Paystack
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook payload
 */

router.post("/webhook/paystack", PaymentController.paystackWebhook)
export default router;
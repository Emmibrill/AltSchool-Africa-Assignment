import { Router } from "express";
import { AttendanceController } from "./attendance.controller";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Ticket attendance and event check-in operations
 */

/**
 * @swagger
 * /attendance/check-in:
 *   post:
 *     summary: Check in an attendee
 *     description: Allows a Creator or Admin to validate and check in a ticket holder at an event gate.
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticketId
 *             properties:
 *               ticketId:
 *                 type: string
 *                 example: ticket_123456
 *                 description: Unique ticket identifier.
 *     responses:
 *       200:
 *         description: Ticket checked in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Attendee checked in successfully
 *                 attendance:
 *                   type: object
 *       400:
 *         description: Invalid ticket or attendee already checked in.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Access denied. Creator or Admin role required.
 *       404:
 *         description: Ticket not found.
 *       500:
 *         description: Internal server error.
 */

// Only CREATOR or ADMIN can scan tickets at event gate
router.post(
  "/check-in",
  authenticate,
  authorizeRole(["CREATOR", "ADMIN"]),
  AttendanceController.checkIn
);

/**
 * @swagger
 * /attendance/scan:
 *   post:
 *     summary: Scan a ticket QR code
 *     description: Scans and validates a ticket QR code. Accessible to any authenticated user.
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qrCode
 *             properties:
 *               qrCode:
 *                 type: string
 *                 example: eyJ0aWNrZXRJZCI6InRpY2tldF8xMjM0NTYifQ==
 *                 description: Encoded QR code value or ticket token.
 *     responses:
 *       200:
 *         description: QR code scanned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 ticketId:
 *                   type: string
 *                   example: ticket_123456
 *                 eventId:
 *                   type: string
 *                   example: event_987654
 *                 status:
 *                   type: string
 *                   example: VALID
 *       400:
 *         description: Invalid or malformed QR code.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Ticket not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/scan", authenticate, AttendanceController.scanQR);

export default router;
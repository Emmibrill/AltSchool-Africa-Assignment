import { Router } from "express";
import { ReminderController } from "./reminder.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();


/**
 * @swagger
 * tags:
 *   name: Reminders
 *   description: Event reminder management endpoints
 */

/**
 * @swagger
 * /reminders:
 *   post:
 *     summary: Create a reminder
 *     description: Creates a reminder for an authenticated user, typically for an event or scheduled activity.
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - remindAt
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: event_123456
 *                 description: ID of the event to be reminded about.
 *               remindAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-20T09:00:00Z"
 *                 description: Date and time when the reminder should be triggered.
 *     responses:
 *       201:
 *         description: Reminder created successfully.
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
 *                   example: Reminder created successfully
 *                 reminder:
 *                   type: object
 *       400:
 *         description: Invalid request data.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

router.post("/", authenticate, ReminderController.create);


/**
 * @swagger
 * /reminders:
 *   get:
 *     summary: Get my reminders
 *     description: Retrieves all reminders belonging to the authenticated user.
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User reminders retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: reminder_123456
 *                   eventId:
 *                     type: string
 *                     example: event_123456
 *                   remindAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-06-20T09:00:00Z"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

router.get("/", authenticate, ReminderController.myReminders);


/**
 * @swagger
 * /reminders/{id}:
 *   delete:
 *     summary: Delete a reminder
 *     description: Deletes a specific reminder belonging to the authenticated user.
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reminder ID.
 *         example: reminder_123456
 *     responses:
 *       200:
 *         description: Reminder deleted successfully.
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
 *                   example: Reminder deleted successfully
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Reminder not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", authenticate, ReminderController.delete);

export default router;
import { Router } from "express";
import { AnalyticsController } from "./analytics.controller";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics management endpoints
 */

/**
 * @swagger
 * /analytics/creator:
 *   get:
 *     summary: Get creator analytics overview
 *     description: Returns an overview of analytics for the authenticated creator, including event performance, revenue, ticket sales, and engagement metrics.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Creator analytics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEvents:
 *                   type: integer
 *                   example: 12
 *                 totalTicketsSold:
 *                   type: integer
 *                   example: 1450
 *                 totalRevenue:
 *                   type: number
 *                   example: 250000
 *                 totalViews:
 *                   type: integer
 *                   example: 8500
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Access denied. Creator role required.
 *       500:
 *         description: Internal server error.
 */


router.get(
  "/creator",
  authenticate,
  authorizeRole(["CREATOR"]),
  AnalyticsController.creatorOverview
);


/**
 * @swagger
 * /analytics/event/{eventId}:
 *   get:
 *     summary: Get analytics for a specific event
 *     description: Returns detailed analytics data for a creator's event.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the event.
 *         example: evt_123456789
 *     responses:
 *       200:
 *         description: Event analytics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 eventId:
 *                   type: string
 *                   example: evt_123456789
 *                 eventName:
 *                   type: string
 *                   example: Tech Conference 2025
 *                 ticketsSold:
 *                   type: integer
 *                   example: 500
 *                 revenue:
 *                   type: number
 *                   example: 150000
 *                 views:
 *                   type: integer
 *                   example: 3200
 *                 conversionRate:
 *                   type: number
 *                   example: 15.6
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Access denied. Creator role required.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
  "/event/:eventId",
  authenticate,
  authorizeRole(["CREATOR"]),
  AnalyticsController.eventAnalytics
);

export default router;
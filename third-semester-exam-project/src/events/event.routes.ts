import { Router } from "express";
import { EventController } from "./event.controller";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Events
 *     description: Event management endpoints
 */

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags:
 *       - Events
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Tech Conference 2026
 *               description:
 *                 type: string
 *                 example: Annual technology conference
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *                 example: Lagos, Nigeria
 *     responses:
 *       201:
 *         description: Event created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only creators can create events
 */

router.post("/", authenticate, authorizeRole(["CREATOR"]), EventController.create);

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 */

router.get("/", EventController.getAll);

/**
 * @swagger
 * /api/events/my-events:
 *   get:
 *     summary: Get all events created by the authenticated creator
 *     tags:
 *       - Events
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Creator events retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */


router.get("/my-events", authenticate, authorizeRole(["CREATOR"]), EventController.myEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get a single event by ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 */


router.get("/:id", EventController.getOne);

/**
 * @swagger
 * /api/events/{id}/attendees:
 *   get:
 *     summary: Get attendees of an event
 *     tags:
 *       - Events
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event attendees retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Event not found
 */


router.get("/:id/attendees",authenticate,authorizeRole(["CREATOR"]),EventController.attendees);

/**
 * @swagger
 * /api/events/{id}/share:
 *   get:
 *     summary: Generate share links for an event
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Share links generated successfully
 *       404:
 *         description: Event not found
 */


router.get("/:id/share", EventController.shareLinks);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an event
 *     tags:
 *       - Events
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Event not found
 */


router.put("/:id", authenticate, authorizeRole(["CREATOR"]), EventController.update);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags:
 *       - Events
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Event not found
 */


router.delete("/:id", authenticate, authorizeRole(["CREATOR"]), EventController.delete);


/**
 * @swagger
 * /api/events/{id}/publish:
 *   patch:
 *     summary: Publish an event
 *     tags:
 *       - Events
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event published successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Event not found
 */


router.patch("/:id/publish", authenticate, authorizeRole(["CREATOR"]), EventController.publish);

export default router;
import { Router } from "express";
import { EventController } from "./event.controller";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeRole(["CREATOR"]),
  EventController.create
);

router.get("/", EventController.getAll);
router.get("/:id", EventController.getOne);

router.put(
  "/:id",
  authenticate,
  authorizeRole(["CREATOR"]),
  EventController.update
);

router.delete(
  "/:id",
  authenticate,
  authorizeRole(["CREATOR"]),
  EventController.delete
);

router.patch(
  "/:id/publish",
  authenticate,
  authorizeRole(["CREATOR"]),
  EventController.publish
);

export default router;
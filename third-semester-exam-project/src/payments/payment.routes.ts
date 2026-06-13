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

// Initialize Payment
router.post(
  "/initialize",
  authenticate,
  authorizeRole(["EVENTEE"]),
  validateBody(initializePaymentSchema),
  PaymentController.initialize,
  
);

router.get("/creator", authenticate, authorizeRole(["CREATOR"]), PaymentController.creatorPayments);


router.get(
  "/verify/:reference",
  authenticate,
  authorizeRole(["EVENTEE"]),
  validateParams(verifyPaymentParamsSchema),
  PaymentController.verify
);

router.get(
  "/event/:eventId",
  authenticate,
  authorizeRole(["CREATOR"]),
  PaymentController.eventPayments
);


router.post(
  "/webhook/paystack",
  PaymentController.paystackWebhook
)
export default router;
import { z } from "zod";

export const initializePaymentSchema = z.object({
  eventId: z.string().min(1, "eventId is required"),
});

export const verifyPaymentParamsSchema = z.object({
  reference: z.string().min(1, "reference is required"),
});
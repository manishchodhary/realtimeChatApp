import { z } from "zod";

export const createMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message connot be empty")
    .max(500, "Message is too long"),
});

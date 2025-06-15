
import { z } from "zod";

export const guestFeedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  visitDate: z.date({
    required_error: "Visit date is required",
  }),
  rating: z.number().min(1).max(5),
  feedback: z.string().min(4, "Please write at least a few words"),
  consentToShare: z.boolean(),
});

export type GuestFeedbackFormData = z.infer<typeof guestFeedbackSchema>;


import { z } from "zod";

export const guestFeedbackSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Please enter a valid email address."),
  visitDate: z.date({
    required_error: "Visit date is required",
  }),
  rating: z.number().min(1).max(5),
  feedback: z.string().min(4, "Please write at least a few words"),
  consentToShare: z.boolean(),
});

export type GuestFeedbackFormData = z.infer<typeof guestFeedbackSchema>;


import { z } from "zod";

export const reservationSchema = z.object({
  reservationType: z.string().min(1, "Please select the type of reservation."),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().optional(),
  email: z.string().email("Please enter a valid email address."),
  partySize: z.coerce.number().min(1, "Party size must be at least 1."),
  reservationDate: z.date({ required_error: "A date is required." }),
  reservationTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please use HH:MM format (e.g., 19:00)."),
  notes: z.string().max(500, "Notes cannot exceed 500 characters.").optional(),
  specialEventReason: z.string().max(100, "Reason cannot exceed 100 characters.").optional(),
}).superRefine((data, ctx) => {
    if (data.reservationType === 'table' && data.partySize < 6) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Reservations for general dining are for parties of 6 or more.",
            path: ["partySize"],
        });
    }
    if (data.reservationType === 'special-event' && (!data.specialEventReason || data.specialEventReason.length < 2)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please provide a reason for the special event.",
            path: ["specialEventReason"],
        });
    }
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

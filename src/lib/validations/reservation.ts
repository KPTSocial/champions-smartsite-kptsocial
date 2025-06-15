
import { z } from "zod";

export const reservationSchema = z.object({
  reservationType: z.string().min(1, "Please select the type of reservation."),
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  partySize: z.coerce.number().min(1, "Party size must be at least 1."),
  reservationDate: z.date({ required_error: "A date is required." }),
  reservationTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please use HH:MM format (e.g., 19:00)."),
  notes: z.string().max(500, "Notes cannot exceed 500 characters.").optional(),
}).refine(data => {
    if (data.reservationType === 'table') {
        return data.partySize >= 6;
    }
    return true;
}, {
    message: "Reservations for general dining are for parties of 6 or more.",
    path: ["partySize"],
});


export type ReservationFormData = z.infer<typeof reservationSchema>;

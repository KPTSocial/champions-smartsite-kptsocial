
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { ReservationFormData } from "@/lib/validations/reservation";
import { sendReservationWebhook, formatDateForWebhook } from "@/utils/reservationWebhookService";

type ReservationInsert = Database["public"]["Tables"]["reservations"]["Insert"];

const addReservation = async (reservation: ReservationInsert) => {
  const { data, error } = await supabase
    .from("reservations")
    .insert(reservation)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to create reservation. " + error.message);
  }
  return data;
};

export const useAddReservation = (form: ReturnType<typeof useForm<ReservationFormData>>) => {
    return useMutation({
        mutationFn: addReservation,
        onSuccess: (data, variables) => {
          // Send webhook with all reservation details
          const webhookPayload = {
            fullName: variables.full_name || '',
            email: variables.email || '',
            partySize: variables.party_size || 0,
            reservationType: variables.reservation_type || '',
            reservationDate: variables.reservation_date || '',
            reservationTime: variables.reservation_date ? new Date(variables.reservation_date).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '',
            notes: variables.notes || null,
            eventId: variables.event_id || null,
            timestamp: new Date().toISOString(),
            formattedDate: variables.reservation_date ? formatDateForWebhook(new Date(variables.reservation_date)) : '',
          };

          // Send webhook (non-blocking)
          sendReservationWebhook(webhookPayload);

          toast({
            title: "Reservation Confirmed!",
            description: "Your table has been booked. We look forward to seeing you!",
          });
          form.reset();
        },
        onError: () => {
          toast({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your reservation. Please try again.",
            variant: "destructive",
          });
        },
    });
}

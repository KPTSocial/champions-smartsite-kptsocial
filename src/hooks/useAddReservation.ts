
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { ReservationFormData } from "@/lib/validations/reservation";

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

const sendReservationWebhook = async (payload: any) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-reservation-webhook', {
      body: payload,
    });

    if (error) {
      console.error('Webhook error:', error);
      // Don't throw - webhook failure shouldn't break reservation
    } else {
      console.log('Webhook sent successfully:', data);
    }
  } catch (error) {
    console.error('Webhook error (non-blocking):', error);
    // Silent error handling - webhook failure shouldn't block reservation
  }
};

const formatDateForWebhook = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
};

export const useAddReservation = (
  form: ReturnType<typeof useForm<ReservationFormData>>, 
  onConfirmationNeeded?: (partySize: number, reservationType: string) => void
) => {
    return useMutation({
        mutationFn: addReservation,
        onSuccess: (data, variables) => {
          // Prepare webhook payload
          const webhookPayload = {
            fullName: variables.full_name || '',
            email: variables.email || '',
            phoneNumber: variables.phone_number || undefined,
            partySize: variables.party_size || 0,
            reservationType: variables.reservation_type || '',
            reservationDate: variables.reservation_date || '',
            reservationTime: variables.reservation_date ? new Date(variables.reservation_date).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '',
            notes: variables.notes || null,
            eventId: variables.event_id || null,
            requiresConfirmation: variables.requires_confirmation || false,
            timestamp: new Date().toISOString(),
            formattedDate: variables.reservation_date ? formatDateForWebhook(new Date(variables.reservation_date)) : '',
          };

          // Send webhook via edge function (non-blocking)
          sendReservationWebhook(webhookPayload);

          // Check if confirmation is needed (only for trivia 6+ now)
          if (variables.requires_confirmation && onConfirmationNeeded) {
            const reservationType = variables.reservation_type === 'Event' ? 
              (variables.event_id ? 'trivia' : 'bingo') : 'table';
            onConfirmationNeeded(variables.party_size || 0, reservationType);
          } else {
            toast({
              title: "Reservation Confirmed!",
              description: "Your table has been booked. We look forward to seeing you!",
            });
          }
          
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

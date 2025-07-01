import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { ReservationFormData } from "@/lib/validations/reservation";

type ReservationInsert = Database["public"]["Tables"]["reservations"]["Insert"];

interface MutationData {
  reservationData: ReservationInsert;
  formData?: ReservationFormData;
  specialEventReason?: string;
}

const addReservation = async (data: MutationData) => {
  console.log("=== RESERVATION SUBMISSION START ===");
  console.log("Full mutation data:", JSON.stringify(data, null, 2));
  console.log("Reservation data being inserted:", JSON.stringify(data.reservationData, null, 2));

  try {
    const { data: result, error } = await supabase
      .from("reservations")
      .insert(data.reservationData)
      .select()
      .single();

    if (error) {
      console.error("=== SUPABASE ERROR ===");
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);
      console.error("Error hint:", error.hint);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      throw new Error(`Failed to create reservation: ${error.message}`);
    }

    console.log("=== RESERVATION SUCCESS ===");
    console.log("Created reservation:", JSON.stringify(result, null, 2));
    return { result, formData: data.formData, specialEventReason: data.specialEventReason };
  } catch (error) {
    console.error("=== RESERVATION CREATION FAILED ===");
    console.error("Caught error:", error);
    throw error;
  }
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
        onSuccess: (data) => {
          console.log("=== MUTATION SUCCESS ===");
          const { result: variables, formData, specialEventReason } = data;
          
          // Determine reservation type for webhook
          let reservationType = 'table';
          let eventType = 'Table';
          
          if (variables.reservation_type === 'Event') {
            // Determine if it's bingo or trivia based on context or event details
            reservationType = variables.event_id ? 'bingo' : 'table'; // This would need proper event lookup
            eventType = variables.event_id ? 'Event' : 'Table';
          }

          // If we have form data, use it to determine correct reservation type
          if (formData?.reservationType) {
            reservationType = formData.reservationType;
            if (formData.reservationType === 'bingo') {
              eventType = 'Bingo';
            } else if (formData.reservationType === 'trivia') {
              eventType = 'Trivia';
            } else if (formData.reservationType === 'special-event') {
              eventType = 'Special Event';
            }
          }

          // Prepare comprehensive webhook payload
          const webhookPayload = {
            fullName: variables.full_name || '',
            email: variables.email || '',
            phoneNumber: variables.phone_number || undefined,
            partySize: variables.party_size || 0,
            reservationType: reservationType,
            reservationDate: variables.reservation_date || '',
            reservationTime: variables.reservation_date ? new Date(variables.reservation_date).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '',
            notes: variables.notes || null,
            specialEventReason: specialEventReason || '',
            eventId: variables.event_id || null,
            eventType: eventType,
            requiresConfirmation: variables.requires_confirmation || false,
            timestamp: new Date().toISOString(),
            formattedDate: variables.reservation_date ? formatDateForWebhook(new Date(variables.reservation_date)) : '',
          };

          // Send webhook via edge function (non-blocking)
          sendReservationWebhook(webhookPayload);

          // Check if confirmation is needed (only for trivia 6+ now)
          if (variables.requires_confirmation && onConfirmationNeeded) {
            onConfirmationNeeded(variables.party_size || 0, reservationType);
          } else {
            toast({
              title: "Reservation Confirmed!",
              description: "Your table has been booked. We look forward to seeing you!",
            });
          }
          
          form.reset();
        },
        onError: (error) => {
          console.error("=== MUTATION ERROR ===");
          console.error("Full error:", error);
          console.error("Error message:", error.message);
          
          let errorMessage = "There was a problem with your reservation. Please try again.";
          
          // Provide more specific error messages based on the error
          if (error.message.includes("row-level security")) {
            errorMessage = "Permission denied. Please refresh the page and try again.";
          } else if (error.message.includes("duplicate key")) {
            errorMessage = "A reservation with these details already exists.";
          } else if (error.message.includes("foreign key")) {
            errorMessage = "Selected event is no longer available.";
          }
          
          toast({
            title: "Uh oh! Something went wrong.",
            description: errorMessage,
            variant: "destructive",
          });
        },
    });
}

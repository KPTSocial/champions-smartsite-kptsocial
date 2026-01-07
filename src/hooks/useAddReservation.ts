import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

import { supabase } from "@/integrations/supabase/client";
import { ReservationFormData } from "@/lib/validations/reservation";

// Define locally since reservations table was archived
export type ReservationInsert = {
  full_name: string;
  email: string;
  reservation_date: string;
  reservation_type: "Event" | "Table";
  party_size: number;
  phone_number?: string | null;
  notes?: string | null;
  event_id?: string | null;
  requires_confirmation?: boolean | null;
};

interface MutationData {
  reservationData: ReservationInsert;
  formData?: ReservationFormData;
  specialEventReason?: string;
}

const addReservation = async (data: MutationData) => {
  console.log("=== RESERVATION SUBMISSION START ===");
  console.log("Full reservation data:", JSON.stringify(data.reservationData, null, 2));

  try {
    // Use edge function instead of direct database insert to bypass RLS issues
    const { data: result, error } = await supabase.functions.invoke('create-reservation', {
      body: {
        ...data.reservationData,
        formData: data.formData,
        specialEventReason: data.specialEventReason
      }
    });

    if (error) {
      console.error("=== EDGE FUNCTION ERROR ===");
      console.error("Error:", error);
      throw new Error(`Failed to create reservation: ${error.message}`);
    }

    if (!result.success) {
      console.error("=== RESERVATION CREATION FAILED ===");
      console.error("Result:", result);
      throw new Error(result.details || 'Unknown error occurred');
    }

    console.log("=== RESERVATION SUCCESS ===");
    console.log("Created reservation:", JSON.stringify(result.reservation, null, 2));
    return { result: result.reservation, formData: data.formData, specialEventReason: data.specialEventReason };
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
          
          // Determine reservation type from form data
          let reservationType = 'table';
          
          if (formData?.reservationType) {
            reservationType = formData.reservationType;
          }

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

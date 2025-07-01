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
  console.log("Supabase client:", supabase);
  console.log("Auth user:", await supabase.auth.getUser());
  console.log("Full mutation data:", JSON.stringify(data, null, 2));
  console.log("Reservation data being inserted:", JSON.stringify(data.reservationData, null, 2));
  
  // Test with minimal data first
  const minimalData = {
    full_name: data.reservationData.full_name,
    email: data.reservationData.email,
    party_size: data.reservationData.party_size,
    reservation_date: data.reservationData.reservation_date,
    reservation_type: data.reservationData.reservation_type,
  };
  
  console.log("Testing with minimal data:", JSON.stringify(minimalData, null, 2));

  try {
    const { data: result, error } = await supabase
      .from("reservations")
      .insert(minimalData)
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
          
          // Skip webhook for now - just confirm success
          toast({
            title: "Reservation Confirmed!",
            description: "Your table has been booked successfully!",
          });
          
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

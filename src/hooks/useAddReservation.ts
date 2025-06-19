
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

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
        onSuccess: async (data, variables) => {
          console.log('🎉 Reservation created successfully in database:', data);
          console.log('📋 Database variables:', variables);
          
          // Get the original form data to send proper webhook
          const formData = form.getValues();
          console.log('📝 Original form data for webhook:', formData);

          // Build proper webhook payload with original form data
          const webhookPayload = {
            fullName: variables.full_name || '',
            email: variables.email || '',
            phoneNumber: variables.phone_number || undefined,
            partySize: variables.party_size || 0,
            reservationType: formData.reservationType || '', // Original form selection
            reservationDate: variables.reservation_date || '',
            reservationTime: formData.reservationTime || '', // Original form time
            notes: variables.notes || null,
            specialEventReason: formData.specialEventReason || undefined,
            eventId: variables.event_id || null,
            eventType: variables.event_id ? (formData.reservationType === 'bingo' ? 'Bingo' : 'Trivia') : undefined,
            timestamp: new Date().toISOString(),
            formattedDate: variables.reservation_date ? formatDateForWebhook(new Date(variables.reservation_date)) : '',
          };

          console.log('🎯 Final webhook payload prepared:', webhookPayload);
          console.log('📞 Phone number check:', {
            fromForm: formData.phoneNumber,
            fromVariables: variables.phone_number,
            finalValue: webhookPayload.phoneNumber
          });
          console.log('🎭 Reservation type check:', {
            fromForm: formData.reservationType,
            fromDatabase: variables.reservation_type,
            finalValue: webhookPayload.reservationType
          });

          // Send webhook (non-blocking with enhanced logging)
          console.log('🚀 Initiating webhook send...');
          try {
            await sendReservationWebhook(webhookPayload);
            
            // Show success toast with webhook info
            toast({
              title: "Reservation Confirmed!",
              description: "Your table has been booked and notification sent. We look forward to seeing you!",
            });
          } catch (webhookError) {
            console.error('⚠️ Webhook failed but reservation was saved:', webhookError);
            
            // Still show success for reservation, but note webhook issue
            toast({
              title: "Reservation Confirmed!",
              description: "Your table has been booked. We look forward to seeing you!",
            });
          }

          form.reset();
        },
        onError: (error) => {
          console.error('💥 Reservation creation failed:', error);
          toast({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your reservation. Please try again.",
            variant: "destructive",
          });
        },
    });
}

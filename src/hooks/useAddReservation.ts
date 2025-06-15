
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

export const useAddReservation = (form: ReturnType<typeof useForm<ReservationFormData>>) => {
    return useMutation({
        mutationFn: addReservation,
        onSuccess: () => {
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


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import { reservationSchema, ReservationFormData } from "@/lib/validations/reservation";
import { useAddReservation } from "@/hooks/useAddReservation";
import { Database } from "@/integrations/supabase/types";
import { getEvents, Event } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ReservationTypeSelect } from "./reservation-form/ReservationTypeSelect";
import { SpecialEventField } from "./reservation-form/SpecialEventField";
import { ContactFields } from "./reservation-form/ContactFields";
import { BookingFields } from "./reservation-form/BookingFields";
import { ConfirmationCallDialog } from "./reservation-form/ConfirmationCallDialog";

type ReservationInsert = Database["public"]["Tables"]["reservations"]["Insert"];

const ReservationForm = () => {
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState({ partySize: 0, reservationType: '' });

  const { data: events, isLoading: isLoadingEvents } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: getEvents,
  });
  
  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      reservationType: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      partySize: 1,
      reservationDate: undefined,
      reservationTime: "18:00",
      notes: "",
      specialEventReason: "",
    },
  });

  const handleConfirmationNeeded = (partySize: number, reservationType: string) => {
    setConfirmationDetails({ partySize, reservationType });
    setShowConfirmationDialog(true);
  };

  const mutation = useAddReservation(form, handleConfirmationNeeded);

  const onSubmit = (data: ReservationFormData) => {
    console.log("=== FORM SUBMISSION START ===");
    console.log("Form data:", JSON.stringify(data, null, 2));
    
    const [hour, minute] = data.reservationTime.split(':').map(Number);
    const combinedDateTime = new Date(data.reservationDate);
    combinedDateTime.setHours(hour, minute);

    console.log("Combined date/time:", combinedDateTime.toISOString());

    // Concatenate full name for DB insertion
    const fullName = data.lastName 
      ? `${data.firstName.trim()} ${data.lastName.trim()}`
      : data.firstName.trim();

    console.log("Full name:", fullName);

    // Determine if confirmation is required
    const requiresConfirmation = (data.reservationType === 'trivia' || data.reservationType === 'bingo') && data.partySize >= 5;

    console.log("Requires confirmation:", requiresConfirmation);

    if (data.reservationType === 'bingo' || data.reservationType === 'trivia') {
        console.log("Processing event reservation...");
        const eventTypeName = data.reservationType === 'bingo' ? 'Bingo' : 'Trivia';
        const selectedDate = new Date(data.reservationDate);
        selectedDate.setHours(0, 0, 0, 0);

        const matchingEvent = events?.find(event => {
            if (!event.event_date) return false;
            const eventDate = new Date(event.event_date);
            eventDate.setHours(0, 0, 0, 0);
            
            // Both bingo and trivia are Game Night events, check title for specific type
            return event.event_type === 'Game Night' && 
                   eventDate.getTime() === selectedDate.getTime() &&
                   event.event_title?.toLowerCase().includes(eventTypeName.toLowerCase());
        });

        console.log("Matching event found:", matchingEvent);

        if (!matchingEvent) {
            console.log("No matching event found for date/type");
            form.setError('reservationDate', { 
                type: 'manual', 
                message: `No ${eventTypeName} Night is scheduled for this date. Please select a date with available events.` 
            });
            return;
        }

        const reservationData: ReservationInsert = {
          full_name: fullName,
          email: data.email,
          phone_number: data.phoneNumber || null,
          party_size: data.partySize,
          reservation_date: combinedDateTime.toISOString(),
          notes: data.notes || null,
          reservation_type: 'Event',
          event_id: matchingEvent.id,
          requires_confirmation: requiresConfirmation,
        };

        console.log("Event reservation data:", JSON.stringify(reservationData, null, 2));

        // Pass data with context for webhook
        mutation.mutate({
          reservationData,
          formData: data,
          specialEventReason: data.specialEventReason
        });

    } else { // 'table' or 'special-event'
        console.log("Processing table/special-event reservation...");
        let finalNotes = data.notes || '';
        const specialEventReason = data.specialEventReason || '';
        
        if (data.reservationType === 'special-event' && specialEventReason) {
          finalNotes = `Special Event: ${specialEventReason}\n\n${finalNotes}`.trim();
        }

        const reservationData: ReservationInsert = {
          full_name: fullName,
          email: data.email,
          phone_number: data.phoneNumber || null,
          party_size: data.partySize,
          reservation_date: combinedDateTime.toISOString(),
          notes: finalNotes || null,
          reservation_type: 'Table',
          event_id: null,
          requires_confirmation: requiresConfirmation,
        };

        console.log("Table reservation data:", JSON.stringify(reservationData, null, 2));

        // Pass data with context for webhook
        mutation.mutate({
          reservationData,
          formData: data,
          specialEventReason: specialEventReason
        });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ReservationTypeSelect />
          <SpecialEventField />
          <ContactFields />
          <BookingFields />
          
          <Button type="submit" className="w-full" disabled={mutation.isPending || isLoadingEvents}>
            {mutation.isPending ? 'Booking...' : 'Book Your Spot'}
          </Button>
        </form>
      </Form>

      <ConfirmationCallDialog 
        open={showConfirmationDialog}
        onOpenChange={setShowConfirmationDialog}
        partySize={confirmationDetails.partySize}
        reservationType={confirmationDetails.reservationType}
      />
    </>
  );
};

export default ReservationForm;

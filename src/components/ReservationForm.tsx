
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
    const [hour, minute] = data.reservationTime.split(':').map(Number);
    const combinedDateTime = new Date(data.reservationDate);
    combinedDateTime.setHours(hour, minute);

    // Concatenate full name for DB insertion
    const fullName = data.lastName 
      ? `${data.firstName.trim()} ${data.lastName.trim()}`
      : data.firstName.trim();

    // Only trivia reservations with 6+ people require confirmation now
    const requiresConfirmation = 
      (data.reservationType === 'trivia' && data.partySize >= 6);

    if (data.reservationType === 'bingo' || data.reservationType === 'trivia') {
        const eventType = data.reservationType === 'bingo' ? 'Bingo' : 'Trivia';
        const selectedDate = new Date(data.reservationDate);
        selectedDate.setHours(0, 0, 0, 0);

        const matchingEvent = events?.find(event => {
            if (!event.event_date) return false;
            const eventDate = new Date(event.event_date);
            eventDate.setHours(0, 0, 0, 0);
            return String(event.event_type) === eventType && eventDate.getTime() === selectedDate.getTime();
        });

        if (!matchingEvent) {
            form.setError('reservationDate', { type: 'manual', message: `No ${eventType} Night is scheduled for this date.` });
            return;
        }

        const reservationData: ReservationInsert = {
          full_name: fullName,
          email: data.email,
          phone_number: data.phoneNumber,
          party_size: data.partySize,
          reservation_date: combinedDateTime.toISOString(),
          notes: data.notes,
          reservation_type: 'Event',
          event_id: matchingEvent.id,
          requires_confirmation: requiresConfirmation,
        };

        // Store special event reason for webhook
        (reservationData as any).specialEventReason = data.specialEventReason || '';

        mutation.mutate(reservationData);

    } else { // 'table' or 'special-event'
        let finalNotes = data.notes || '';
        let specialEventReason = '';
        
        if (data.reservationType === 'special-event' && data.specialEventReason) {
          specialEventReason = data.specialEventReason;
          finalNotes = `Special Event: ${data.specialEventReason}\n\n${finalNotes}`.trim();
        }

        const reservationData: ReservationInsert = {
          full_name: fullName,
          email: data.email,
          phone_number: data.phoneNumber,
          party_size: data.partySize,
          reservation_date: combinedDateTime.toISOString(),
          notes: finalNotes || null,
          reservation_type: 'Table',
          event_id: null,
          requires_confirmation: requiresConfirmation,
        };

        // Store special event reason for webhook
        (reservationData as any).specialEventReason = specialEventReason;

        mutation.mutate(reservationData);
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


import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { reservationSchema, ReservationFormData } from "@/lib/validations/reservation";
import { useAddReservation } from "@/hooks/useAddReservation";
import { Database } from "@/integrations/supabase/types";
import { getEvents, Event } from "@/services/eventService";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ReservationInsert = Database["public"]["Tables"]["reservations"]["Insert"];

const reservationTypes = [
  { value: "table", label: "General Dining" },
  { value: "bingo", label: "Bingo Night" },
  { value: "trivia", label: "Trivia Night" },
  { value: "special-event", label: "Special Event" },
];

const ReservationForm = () => {
  const { data: events, isLoading: isLoadingEvents } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: getEvents,
  });
  
  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      reservationType: "",
      fullName: "",
      email: "",
      partySize: 1,
      reservationDate: undefined,
      reservationTime: "18:00",
      notes: "",
      specialEventReason: "",
    },
  });

  const mutation = useAddReservation(form);
  const reservationType = form.watch("reservationType");

  const onSubmit = (data: ReservationFormData) => {
    const [hour, minute] = data.reservationTime.split(':').map(Number);
    const combinedDateTime = new Date(data.reservationDate);
    combinedDateTime.setHours(hour, minute);

    if (data.reservationType === 'bingo' || data.reservationType === 'trivia') {
        const eventType = data.reservationType === 'bingo' ? 'Bingo' : 'Trivia';
        const selectedDate = new Date(data.reservationDate);
        selectedDate.setHours(0, 0, 0, 0);

        const matchingEvent = events?.find(event => {
            if (!event.event_date) return false;
            const eventDate = new Date(event.event_date);
            eventDate.setHours(0, 0, 0, 0);
            return event.event_type === eventType && eventDate.getTime() === selectedDate.getTime();
        });

        if (!matchingEvent) {
            form.setError('reservationDate', { type: 'manual', message: `No ${eventType} Night is scheduled for this date.` });
            return;
        }

        const reservationData: ReservationInsert = {
          full_name: data.fullName,
          email: data.email,
          party_size: data.partySize,
          reservation_date: combinedDateTime.toISOString(),
          notes: data.notes,
          reservation_type: 'Event',
          event_id: matchingEvent.id,
        };
        mutation.mutate(reservationData);

    } else { // 'table' or 'special-event'
        let finalNotes = data.notes || '';
        if (data.reservationType === 'special-event' && data.specialEventReason) {
          finalNotes = `Special Event: ${data.specialEventReason}\n\n${finalNotes}`.trim();
        }

        const reservationData: ReservationInsert = {
          full_name: data.fullName,
          email: data.email,
          party_size: data.partySize,
          reservation_date: combinedDateTime.toISOString(),
          notes: finalNotes || null,
          reservation_type: 'Table',
          event_id: null,
        };
        mutation.mutate(reservationData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
            control={form.control}
            name="reservationType"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Reservation For</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a reservation type..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {reservationTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />

        {reservationType === 'special-event' && (
            <FormField
                control={form.control}
                name="specialEventReason"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Reason for Special Event</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Birthday Party" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                    <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="partySize"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Party Size {reservationType === 'table' ? '(6+)' : ''}</FormLabel>
                    <FormControl>
                        <Input type="number" min={reservationType === 'table' ? 6 : 1} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="reservationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reservationTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time (24hr format)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 19:30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special requests or dietary restrictions?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={mutation.isPending || isLoadingEvents}>
          {mutation.isPending ? 'Booking...' : 'Book Your Spot'}
        </Button>
      </form>
    </Form>
  );
};

export default ReservationForm;

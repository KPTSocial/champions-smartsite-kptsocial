
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const reservationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  partySize: z.coerce.number().min(1, "Party size must be at least 1."),
  reservationDate: z.date({ required_error: "A date is required." }),
  reservationTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please use HH:MM format (e.g., 19:00)."),
  notes: z.string().max(500, "Notes cannot exceed 500 characters.").optional(),
});

type ReservationFormData = z.infer<typeof reservationSchema>;
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

const ReservationForm = () => {
  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      partySize: 1,
      reservationDate: undefined,
      reservationTime: "18:00",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: addReservation,
    onSuccess: () => {
      toast({
        title: "Reservation Confirmed!",
        description: "Your table has been booked. We look forward to seeing you!",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your reservation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReservationFormData) => {
    const [hour, minute] = data.reservationTime.split(':').map(Number);
    const combinedDateTime = new Date(data.reservationDate);
    combinedDateTime.setHours(hour, minute);

    const reservationData: ReservationInsert = {
      full_name: data.fullName,
      email: data.email,
      party_size: data.partySize,
      reservation_date: combinedDateTime.toISOString(),
      notes: data.notes,
      reservation_type: 'Table',
    };
    
    mutation.mutate(reservationData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FormLabel>Party Size</FormLabel>
                    <FormControl>
                        <Input type="number" min="1" {...field} />
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
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Booking...' : 'Book Your Table'}
        </Button>
      </form>
    </Form>
  );
};

export default ReservationForm;

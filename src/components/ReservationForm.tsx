
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { reservationSchema, ReservationFormData } from "@/lib/validations/reservation";
import { useAddReservation } from "@/hooks/useAddReservation";
import { Database } from "@/integrations/supabase/types";
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

type ReservationInsert = Database["public"]["Tables"]["reservations"]["Insert"];

const ReservationForm = () => {
  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      partySize: 6,
      reservationDate: undefined,
      reservationTime: "18:00",
      notes: "",
    },
  });

  const mutation = useAddReservation(form);

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
                    <FormLabel>Party Size (6+)</FormLabel>
                    <FormControl>
                        <Input type="number" min="6" {...field} />
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

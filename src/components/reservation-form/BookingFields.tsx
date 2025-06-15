
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from '@/components/ui/textarea';
import { ReservationFormData } from '@/lib/validations/reservation';

export const BookingFields = () => {
  const { control, watch } = useFormContext<ReservationFormData>();
  const reservationType = watch("reservationType");

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
              control={control}
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
            control={control}
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
            control={control}
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
        control={control}
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
    </>
  );
};

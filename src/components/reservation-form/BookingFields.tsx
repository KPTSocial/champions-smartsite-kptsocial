
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ReservationFormData } from '@/lib/validations/reservation';
import { EventCalendarField } from './EventCalendarField';

export const BookingFields = () => {
  const { control } = useFormContext<ReservationFormData>();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
              control={control}
              name="partySize"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Party Size <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                      <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
          />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <EventCalendarField />
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

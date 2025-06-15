
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ReservationFormData } from '@/lib/validations/reservation';

export const SpecialEventField = () => {
  const { control, watch } = useFormContext<ReservationFormData>();
  const reservationType = watch("reservationType");

  if (reservationType !== 'special-event') {
    return null;
  }

  return (
    <FormField
      control={control}
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
  );
};

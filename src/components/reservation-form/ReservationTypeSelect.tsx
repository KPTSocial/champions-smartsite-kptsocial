
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReservationFormData } from '@/lib/validations/reservation';

const reservationTypes = [
  { value: "table", label: "General Dining" },
  { value: "bingo", label: "Bingo Night" },
  { value: "trivia", label: "Trivia Night" },
  { value: "special-event", label: "Special Event" },
];

export const ReservationTypeSelect = () => {
  const { control } = useFormContext<ReservationFormData>();

  return (
    <FormField
      control={control}
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
  );
};

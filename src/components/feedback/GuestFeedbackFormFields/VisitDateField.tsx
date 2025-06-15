
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { GuestFeedbackFormData } from "@/lib/validations/guestFeedback";
import { format } from "date-fns";

export const VisitDateField = () => {
  const { control } = useFormContext<GuestFeedbackFormData>();
  return (
    <FormField
      control={control}
      name="visitDate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Visit Date</FormLabel>
          <FormControl>
            <Input
              type="date"
              onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
              value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
              required
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

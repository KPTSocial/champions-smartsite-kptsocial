
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { GuestFeedbackFormData } from "@/lib/validations/guestFeedback";

export const RatingField = () => {
  const { control } = useFormContext<GuestFeedbackFormData>();
  return (
    <FormField
      control={control}
      name="rating"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Star Rating (1–5)</FormLabel>
          <FormControl>
            <Input
              type="number"
              min={1}
              max={5}
              step={1}
              value={field.value}
              onChange={e => field.onChange(Number(e.target.value))}
              required
              className="w-24"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

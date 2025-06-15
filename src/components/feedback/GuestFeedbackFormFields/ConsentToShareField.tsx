
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { GuestFeedbackFormData } from "@/lib/validations/guestFeedback";

export const ConsentToShareField = () => {
  const { control } = useFormContext<GuestFeedbackFormData>();
  return (
    <FormField
      control={control}
      name="consentToShare"
      render={({ field }) => (
        <FormItem className="flex items-center gap-2 mt-2">
          <FormControl>
            <input
              type="checkbox"
              checked={field.value}
              onChange={e => field.onChange(e.target.checked)}
              id="consent_to_share"
              className="mr-2"
            />
          </FormControl>
          <FormLabel htmlFor="consent_to_share" className="text-sm font-normal">
            Okay to publicly share this review
          </FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

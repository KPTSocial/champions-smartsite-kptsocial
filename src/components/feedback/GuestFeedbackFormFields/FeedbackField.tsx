
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { GuestFeedbackFormData } from "@/lib/validations/guestFeedback";

export const FeedbackField = () => {
  const { control } = useFormContext<GuestFeedbackFormData>();
  return (
    <FormField
      control={control}
      name="feedback"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Share Your Feedback</FormLabel>
          <FormControl>
            <Textarea
              rows={4}
              placeholder="How was your experience?"
              {...field}
              required
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

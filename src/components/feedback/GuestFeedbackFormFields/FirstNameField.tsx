
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { GuestFeedbackFormData } from "@/lib/validations/guestFeedback";

export const FirstNameField = () => {
  const { control } = useFormContext<GuestFeedbackFormData>();
  return (
    <FormField
      control={control}
      name="firstName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
          <FormControl>
            <Input placeholder="Jane" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

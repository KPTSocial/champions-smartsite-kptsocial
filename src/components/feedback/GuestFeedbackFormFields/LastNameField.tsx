
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { GuestFeedbackFormData } from "@/lib/validations/guestFeedback";

export const LastNameField = () => {
  const { control } = useFormContext<GuestFeedbackFormData>();
  return (
    <FormField
      control={control}
      name="lastName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Last Name <span className="text-muted-foreground">(Optional)</span></FormLabel>
          <FormControl>
            <Input placeholder="Doe" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

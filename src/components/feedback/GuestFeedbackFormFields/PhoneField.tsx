
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GuestFeedbackFormData } from "@/lib/validations/guestFeedback";

export const PhoneField = () => {
  const { control } = useFormContext<GuestFeedbackFormData>();

  return (
    <FormField
      control={control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone (Optional)</FormLabel>
          <FormControl>
            <Input
              type="tel"
              placeholder="(503) 555-1234"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

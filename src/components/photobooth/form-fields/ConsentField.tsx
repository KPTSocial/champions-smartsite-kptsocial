
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Control } from 'react-hook-form';
import type { PhotoFormValues } from '@/lib/validations/photoBoothForm';

interface ConsentFieldProps {
  control: Control<PhotoFormValues>;
}

const ConsentField: React.FC<ConsentFieldProps> = ({ control }) => {
  return (
    <FormField control={control} name="consent" render={({ field }) => (
      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <FormControl>
          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
        </FormControl>
        <div className="space-y-1 leading-none">
          <FormLabel>I consent to have this photo shared publicly.</FormLabel>
        </div>
      </FormItem>
    )} />
  );
};

export default ConsentField;

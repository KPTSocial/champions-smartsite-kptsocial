
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Control } from 'react-hook-form';
import type { MobilePhotoValues } from '@/lib/validations/mobilePhoto';

interface MobileConsentFieldProps {
  control: Control<MobilePhotoValues>;
}

const MobileConsentField: React.FC<MobileConsentFieldProps> = ({ control }) => {
  return (
    <FormField control={control} name="consent" render={({ field }) => (
      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-blue-50 border-blue-200">
        <FormControl>
          <Checkbox 
            checked={field.value} 
            onCheckedChange={field.onChange}
            className="mt-1"
          />
        </FormControl>
        <div className="space-y-1 leading-none">
          <FormLabel className="text-sm font-medium text-blue-900">
            I consent to have this photo shared publicly
          </FormLabel>
          <p className="text-xs text-blue-700">
            Your photo may be featured on our social media and website
          </p>
          <FormMessage />
        </div>
      </FormItem>
    )} />
  );
};

export default MobileConsentField;

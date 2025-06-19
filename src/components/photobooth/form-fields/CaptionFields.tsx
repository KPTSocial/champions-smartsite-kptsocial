
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Control } from 'react-hook-form';
import type { PhotoFormValues } from '@/lib/validations/photoBoothForm';

interface CaptionFieldsProps {
  control: Control<PhotoFormValues>;
  captionValue: string | undefined;
}

const CaptionFields: React.FC<CaptionFieldsProps> = ({ control, captionValue }) => {
  return (
    <>
      <FormField control={control} name="caption" render={({ field }) => (
        <FormItem>
          <FormLabel>
            Caption <span className="text-muted-foreground">(optional)</span>
          </FormLabel>
          <FormControl>
            <Textarea placeholder="Best night ever at Champions!" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      
      {!captionValue?.trim() && (
        <FormField control={control} name="wantAICaption" render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Let AI create a Champions-branded caption for my photo (will use hashtags like #ChampionsLife).
              </FormLabel>
            </div>
          </FormItem>
        )} />
      )}
    </>
  );
};

export default CaptionFields;

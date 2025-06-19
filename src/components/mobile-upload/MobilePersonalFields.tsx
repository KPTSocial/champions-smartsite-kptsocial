
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import type { MobilePhotoValues } from '@/lib/validations/mobilePhoto';

interface MobilePersonalFieldsProps {
  control: Control<MobilePhotoValues>;
}

const MobilePersonalFields: React.FC<MobilePersonalFieldsProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <FormField control={control} name="firstName" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base">First Name</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              placeholder="Your first name"
              className="h-12 text-base"
              autoComplete="given-name"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={control} name="lastName" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base">Last Name</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              placeholder="Your last name"
              className="h-12 text-base"
              autoComplete="family-name"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={control} name="email" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base">Email</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              type="email"
              placeholder="your.email@example.com"
              className="h-12 text-base"
              autoComplete="email"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
};

export default MobilePersonalFields;

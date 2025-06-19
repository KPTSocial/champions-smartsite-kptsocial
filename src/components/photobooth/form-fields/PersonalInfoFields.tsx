
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import type { PhotoFormValues } from '@/lib/validations/photoBoothForm';

interface PersonalInfoFieldsProps {
  control: Control<PhotoFormValues>;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ control }) => {
  return (
    <>
      <FormField control={control} name="firstName" render={({ field }) => (
        <FormItem>
          <FormLabel>First Name</FormLabel>
          <FormControl>
            <Input placeholder="Your first name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      
      <FormField control={control} name="lastName" render={({ field }) => (
        <FormItem>
          <FormLabel>Last Name</FormLabel>
          <FormControl>
            <Input placeholder="Your last name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      
      <FormField control={control} name="email" render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="you@example.com" type="email" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </>
  );
};

export default PersonalInfoFields;

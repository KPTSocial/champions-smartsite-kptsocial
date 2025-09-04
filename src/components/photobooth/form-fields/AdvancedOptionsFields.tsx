import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, Settings } from 'lucide-react';
import { Control } from 'react-hook-form';
import type { PhotoFormValues } from '@/lib/validations/photoBoothForm';
import { watermarkPositions } from '@/lib/validations/photoBoothForm';

interface AdvancedOptionsFieldsProps {
  control: Control<PhotoFormValues>;
}

const AdvancedOptionsFields: React.FC<AdvancedOptionsFieldsProps> = ({ control }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const watermarkPositionLabels = {
    'south_east': 'Bottom Right',
    'south_west': 'Bottom Left',
    'north_east': 'Top Right',
    'north_west': 'Top Left',
  };

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          type="button"
        >
          <span className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced Options
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        {/* Event Name Field */}
        <FormField 
          control={control} 
          name="eventName" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Trivia Night, Birthday Party, etc." 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Help us categorize your photo by event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />

        {/* Tags Field */}
        <FormField 
          control={control} 
          name="tags" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="fun, friends, celebration (comma-separated)" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Add tags to help organize your photo (comma-separated)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )} 
        />

        {/* Watermark Scale Field */}
        <FormField 
          control={control} 
          name="watermarkScale" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Watermark Size</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <Slider
                    min={0.1}
                    max={0.5}
                    step={0.1}
                    value={[field.value || 0.2]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Small (10%)</span>
                    <span className="font-medium">
                      {((field.value || 0.2) * 100).toFixed(0)}%
                    </span>
                    <span>Large (50%)</span>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Adjust the size of the Champions watermark on your photo
              </FormDescription>
            </FormItem>
          )} 
        />

        {/* Watermark Position Field */}
        <FormField 
          control={control} 
          name="watermarkPosition" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Watermark Position</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || 'south_east'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select watermark position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {watermarkPositions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {watermarkPositionLabels[position]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose where the watermark appears on your photo
              </FormDescription>
            </FormItem>
          )} 
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AdvancedOptionsFields;
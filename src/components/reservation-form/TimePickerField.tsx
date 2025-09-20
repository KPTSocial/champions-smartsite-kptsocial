import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReservationFormData } from '@/lib/validations/reservation';

export const TimePickerField = () => {
  const { control, setValue, watch } = useFormContext<ReservationFormData>();
  
  // Watch the combined time value
  const currentTime = watch('reservationTime');
  
  // Parse the current 24-hour time into components for initial values
  const parseTimeComponents = (time24: string) => {
    if (!time24 || !time24.includes(':')) {
      return { hour: '6', minute: '00', period: 'PM' };
    }
    
    const [hourStr, minuteStr] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr || '00';
    
    let period = 'AM';
    if (hour === 0) {
      hour = 12;
      period = 'AM';
    } else if (hour === 12) {
      period = 'PM';
    } else if (hour > 12) {
      hour = hour - 12;
      period = 'PM';
    }
    
    return {
      hour: hour.toString(),
      minute,
      period
    };
  };
  
  const timeComponents = parseTimeComponents(currentTime);
  
  // Update the main time field when any component changes
  const updateTime = (hour: string, minute: string, period: string) => {
    let hour24 = parseInt(hour, 10);
    
    if (period === 'AM') {
      if (hour24 === 12) {
        hour24 = 0;
      }
    } else {
      if (hour24 !== 12) {
        hour24 = hour24 + 12;
      }
    }
    
    const time24 = `${hour24.toString().padStart(2, '0')}:${minute}`;
    setValue('reservationTime', time24);
  };
  
  return (
    <FormField
      control={control}
      name="reservationTime"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Time <span className="text-destructive">*</span></FormLabel>
          <div className="flex gap-2">
            <Select
              value={timeComponents.hour}
              onValueChange={(hour) => updateTime(hour, timeComponents.minute, timeComponents.period)}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <span className="flex items-center text-lg font-semibold">:</span>
            
            <Select
              value={timeComponents.minute}
              onValueChange={(minute) => updateTime(timeComponents.hour, minute, timeComponents.period)}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="00">00</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="45">45</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={timeComponents.period}
              onValueChange={(period) => updateTime(timeComponents.hour, timeComponents.minute, period)}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FormMessage />
          <p className="text-xs text-muted-foreground mt-1">Pacific Time (PST/PDT)</p>
        </FormItem>
      )}
    />
  );
};
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ReservationFormData } from '@/lib/validations/reservation';
import { getEvents, Event } from "@/services/eventService";

export const EventCalendarField = () => {
  const { control, watch, setError, clearErrors } = useFormContext<ReservationFormData>();
  const reservationType = watch("reservationType");

  const { data: events } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  // Create event days for calendar modifiers
  const eventDays = React.useMemo(() => {
    if (!events) return [];
    
    const eventDates = new Set<string>();
    events.forEach(event => {
      if (event.event_date) {
        const eventDate = new Date(event.event_date);
        const year = eventDate.getFullYear();
        const month = eventDate.getMonth();
        const day = eventDate.getDate();
        
        // Create date string in YYYY-MM-DD format using local date components
        const localDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        eventDates.add(localDateStr);
      }
    });
    
    return Array.from(eventDates).map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    });
  }, [events]);

  // Get events for the selected reservation type
  const getEventsForType = (date: Date, type: string): Event[] => {
    if (!events) return [];
    
    const selectedDateStr = format(date, 'yyyy-MM-dd');
    const eventType = type === 'bingo' ? 'Game Night' : 'Game Night'; // Both bingo and trivia are Game Night events
    
    return events.filter(event => {
      if (!event.event_date) return false;
      
      const eventDate = new Date(event.event_date);
      const eventLocalDateStr = format(eventDate, 'yyyy-MM-dd');
      
      return eventLocalDateStr === selectedDateStr && 
             event.event_type === eventType &&
             (
               (type === 'bingo' && event.event_title?.toLowerCase().includes('bingo')) ||
               (type === 'trivia' && event.event_title?.toLowerCase().includes('trivia'))
             );
    });
  };

  const handleDateSelect = (date: Date | undefined, onChange: (date: Date | undefined) => void) => {
    if (!date) {
      onChange(date);
      return;
    }

    // For bingo and trivia, validate that an event exists on this date
    if (reservationType === 'bingo' || reservationType === 'trivia') {
      const eventsForDate = getEventsForType(date, reservationType);
      
      if (eventsForDate.length === 0) {
        const eventTypeName = reservationType === 'bingo' ? 'Bingo Night' : 'Trivia Night';
        setError('reservationDate', {
          type: 'manual',
          message: `No ${eventTypeName} is scheduled for this date. Please select a date with available events.`
        });
        return;
      } else {
        clearErrors('reservationDate');
      }
    }

    onChange(date);
  };

  return (
    <FormField
      control={control}
      name="reservationDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            Date
            {(reservationType === 'bingo' || reservationType === 'trivia') && (
              <span className="text-sm text-muted-foreground ml-2">
                (Dates with events are highlighted)
              </span>
            )}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => handleDateSelect(date, field.onChange)}
                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                modifiers={{ hasEvent: eventDays }}
                modifiersClassNames={{ hasEvent: 'day-with-event' }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
              <style>{`
                .day-with-event {
                  position: relative;
                  background-color: hsl(var(--primary) / 0.1);
                  border: 1px solid hsl(var(--primary) / 0.3);
                }
                .day-with-event::after {
                  content: '';
                  position: absolute;
                  bottom: 2px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 4px;
                  height: 4px;
                  border-radius: 50%;
                  background-color: hsl(var(--primary));
                }
                .day_today.day-with-event::after {
                  background-color: hsl(var(--accent-foreground));
                }
                .day_selected.day-with-event::after {
                  background-color: hsl(var(--primary-foreground));
                }
              `}</style>
              {field.value && (reservationType === 'bingo' || reservationType === 'trivia') && (
                <div className="p-3 border-t">
                  <div className="text-sm">
                    {(() => {
                      const eventsForDate = getEventsForType(field.value, reservationType);
                      if (eventsForDate.length > 0) {
                        return (
                          <div className="text-green-600">
                            ✓ {reservationType === 'bingo' ? 'Bingo Night' : 'Trivia Night'} available on this date
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-destructive">
                            ✗ No {reservationType === 'bingo' ? 'Bingo Night' : 'Trivia Night'} scheduled for this date
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
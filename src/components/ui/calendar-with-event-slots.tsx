
"use client";

import * as React from "react";
import { format } from "date-fns";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { type Event } from "@/services/eventService";

interface CalendarWithEventSlotsProps {
  events: Event[];
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  onAddEvent?: () => void;
}

export function CalendarWithEventSlots({ 
  events, 
  selectedDate, 
  onDateSelect,
  onAddEvent 
}: CalendarWithEventSlotsProps) {
  const [date, setDate] = React.useState<Date | undefined>(selectedDate);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onDateSelect?.(newDate);
  };

  // Filter events for the selected date using Pacific Time conversion
  const eventsForSelectedDate = React.useMemo(() => {
    if (!date) return [];
    
    // Get the selected date in YYYY-MM-DD format
    const selectedDateStr = format(date, 'yyyy-MM-dd');
    
    return events.filter(event => {
      if (!event.event_date) return false;
      
      // Convert UTC event date to local Pacific Time
      const eventDate = new Date(event.event_date);
      const eventLocalDateStr = format(eventDate, 'yyyy-MM-dd');
      
      return eventLocalDateStr === selectedDateStr;
    });
  }, [events, date]);

  // Create event days for calendar modifiers using Pacific Time
  const eventDays = React.useMemo(() => {
    const eventDates = new Set<string>();
    events.forEach(event => {
      if (event.event_date) {
        // Convert UTC event date to local Pacific Time
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
      // Create local date (not UTC) for calendar display
      return new Date(year, month - 1, day);
    });
  }, [events]);

  const formatEventTime = (eventDate: string) => {
    try {
      // Convert UTC to local Pacific Time and format
      const date = new Date(eventDate);
      return format(date, 'h:mm a');
    } catch {
      return '';
    }
  };

  return (
    <Card className="w-fit py-4">
      <CardContent className="px-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="bg-transparent p-0 pointer-events-auto"
          modifiers={{ hasEvent: eventDays }}
          modifiersClassNames={{ hasEvent: 'day-with-event' }}
          required
        />
        <style>{`
          .day-with-event {
            position: relative;
          }
          .day-with-event::after {
            content: '';
            position: absolute;
            bottom: 6px;
            left: 50%;
            transform: translateX(-50%);
            width: 5px;
            height: 5px;
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
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm font-medium">
            {date?.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          {onAddEvent && (
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              title="Add Event"
              onClick={onAddEvent}
            >
              <PlusIcon />
              <span className="sr-only">Add Event</span>
            </Button>
          )}
        </div>
        <div className="flex w-full flex-col gap-2">
          {eventsForSelectedDate.length === 0 ? (
            <div className="text-sm text-muted-foreground py-2">
              No events scheduled for this date
            </div>
          ) : (
            eventsForSelectedDate.map((event) => (
              <div
                key={event.id}
                className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
              >
                <div className="font-medium">{event.event_title}</div>
                <div className="text-muted-foreground text-xs">
                  {event.event_date && formatEventTime(event.event_date)}
                  {event.event_type && ` • ${event.event_type}`}
                </div>
                {event.description && (
                  <div className="text-muted-foreground text-xs mt-1">
                    {event.description}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

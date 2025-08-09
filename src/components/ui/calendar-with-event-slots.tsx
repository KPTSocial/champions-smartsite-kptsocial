"use client";

import * as React from "react";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
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
      
      // Convert UTC event date to Pacific Time and get the date part
      const eventDatePT = formatInTimeZone(new Date(event.event_date), 'America/Los_Angeles', 'yyyy-MM-dd');
      
      return eventDatePT === selectedDateStr;
    });
  }, [events, date]);

  // Create event days for calendar modifiers using Pacific Time
  const eventDays = React.useMemo(() => {
    const eventDates = new Set<string>();
    events.forEach(event => {
      if (event.event_date) {
        // Convert UTC event date to Pacific Time and get the date part
        const eventDatePT = formatInTimeZone(new Date(event.event_date), 'America/Los_Angeles', 'yyyy-MM-dd');
        eventDates.add(eventDatePT);
      }
    });
    
    return Array.from(eventDates).map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number);
      // Create local date (not UTC) for calendar display
      return new Date(year, month - 1, day);
    });
  }, [events]);

  const formatEventTime = (eventDate: string, eventTitle?: string) => {
    try {
      // Special handling for Taco Tuesday - show full business hours
      if (eventTitle && eventTitle.toLowerCase().includes('taco tuesday')) {
        return '11:00 AM - 10:00 PM PT';
      }
      
      // Convert UTC to Pacific Time and format with consistent AM/PM capitalization
      const timeStr = formatInTimeZone(new Date(eventDate), 'America/Los_Angeles', 'h:mm a');
      return timeStr.toUpperCase() + ' PT';
    } catch {
      return '';
    }
  };

  return (
    <Card className="w-full py-4">
      <CardContent className="px-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="bg-transparent p-0 pointer-events-auto w-full"
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
            bottom: 4px;
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
          
          /* Full width responsive calendar styling */
          .react-flow__node-calendar .react-flow__calendar {
            width: 100% !important;
          }
          
          .react-flow__node-calendar table {
            width: 100% !important;
            table-layout: fixed;
          }
          
          .react-flow__node-calendar .react-flow__head_row,
          .react-flow__node-calendar .react-flow__row {
            display: grid !important;
            grid-template-columns: repeat(7, 1fr) !important;
            gap: 1px;
            width: 100%;
          }
          
          .react-flow__node-calendar .react-flow__head_cell,
          .react-flow__node-calendar .react-flow__cell {
            width: 100% !important;
            height: auto !important;
            min-height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          
          .react-flow__node-calendar .react-flow__day {
            width: 100% !important;
            height: 100% !important;
            min-height: 36px;
            border-radius: 6px;
            font-size: 14px;
          }
          
          /* Mobile responsiveness */
          @media (max-width: 640px) {
            .react-flow__node-calendar .react-flow__head_cell,
            .react-flow__node-calendar .react-flow__cell {
              min-height: 32px;
            }
            
            .react-flow__node-calendar .react-flow__day {
              min-height: 32px;
              font-size: 13px;
            }
            
            .day-with-event::after {
              width: 3px;
              height: 3px;
              bottom: 3px;
            }
          }
          
          /* Tablet responsiveness */
          @media (min-width: 641px) and (max-width: 1024px) {
            .react-flow__node-calendar .react-flow__head_cell,
            .react-flow__node-calendar .react-flow__cell {
              min-height: 40px;
            }
            
            .react-flow__node-calendar .react-flow__day {
              min-height: 40px;
              font-size: 15px;
            }
          }
          
          /* Desktop */
          @media (min-width: 1025px) {
            .react-flow__node-calendar .react-flow__head_cell,
            .react-flow__node-calendar .react-flow__cell {
              min-height: 44px;
            }
            
            .react-flow__node-calendar .react-flow__day {
              min-height: 44px;
              font-size: 16px;
            }
            
            .day-with-event::after {
              width: 5px;
              height: 5px;
              bottom: 5px;
            }
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
          {/* Add Event button hidden for public view */}
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
                className="bg-muted relative rounded-md p-3 text-sm"
              >
                <div className="flex gap-3">
                  {event.image_url && (
                    <div className="flex-shrink-0">
                      <img
                        src={event.image_url}
                        alt={event.event_title || 'Event image'}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{event.event_title}</div>
                    <div className="text-muted-foreground text-xs">
                      {event.event_date && formatEventTime(event.event_date, event.event_title)}
                      {event.event_type && ` • ${event.event_type}`}
                    </div>
                    {event.description && (
                      <div className="text-muted-foreground text-xs mt-1 line-clamp-2">
                        {event.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

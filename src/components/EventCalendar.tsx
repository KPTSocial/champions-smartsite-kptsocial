
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from '@/components/ui/calendar';
import { getEventsByMonth } from '@/services/eventService';
import { isSameDay, parseISO, format } from 'date-fns';
import EventCard from './EventCard';
import { Skeleton } from './ui/skeleton';

const EventCalendar = () => {
  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', format(month, 'yyyy-MM')],
    queryFn: () => getEventsByMonth(month),
  });

  const eventDays = useMemo(() => {
    return events?.map(event => parseISO(event.event_date)) || [];
  }, [events]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDay || !events) return [];
    return events.filter(event => isSameDay(parseISO(event.event_date), selectedDay));
  }, [selectedDay, events]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1 bg-card p-3 rounded-lg border">
            <Calendar
                mode="single"
                selected={selectedDay}
                onSelect={setSelectedDay}
                month={month}
                onMonthChange={setMonth}
                modifiers={{ with_event: eventDays }}
                modifiersClassNames={{ with_event: 'day-with-event' }}
                className="w-full"
            />
            <style>{`.day-with-event { position: relative; } .day-with-event::after { content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; border-radius: 50%; background-color: hsl(var(--primary)); }`}</style>
        </div>
      <div className="md:col-span-2">
        <h3 className="text-2xl font-serif font-semibold mb-4">
          {selectedDay ? `Events for ${format(selectedDay, 'MMMM do, yyyy')}` : 'Select a day to see events'}
        </h3>
        {isLoading && <Skeleton className="h-48 w-full" />}
        {!isLoading && selectedDayEvents.length > 0 && (
          <div className="space-y-4">
            {selectedDayEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
        {!isLoading && selectedDayEvents.length === 0 && (
          <div className="text-center text-muted-foreground bg-card border rounded-lg p-8">
            <p>No events scheduled for this day.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;


import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from '@/components/ui/calendar';
import { getEventsByMonth } from '@/services/eventService';
import { parseISO, format } from 'date-fns';

const EventCalendar = () => {
  const [month, setMonth] = useState(new Date());

  const { data: events } = useQuery({
    queryKey: ['events', format(month, 'yyyy-MM')],
    queryFn: () => getEventsByMonth(month),
  });

  const eventDays = useMemo(() => {
    return events?.map(event => parseISO(event.event_date)) || [];
  }, [events]);

  return (
    <div className="flex justify-center">
        <div className="bg-card p-3 rounded-lg border w-full max-w-md">
            <Calendar
                month={month}
                onMonthChange={setMonth}
                modifiers={{ with_event: eventDays }}
                modifiersClassNames={{ with_event: 'day-with-event' }}
                className="w-full"
            />
            <style>{`.day-with-event { position: relative; } .day-with-event::after { content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; border-radius: 50%; background-color: hsl(var(--primary)); }`}</style>
        </div>
    </div>
  );
};

export default EventCalendar;

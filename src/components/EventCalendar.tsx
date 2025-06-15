
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from '@/components/ui/calendar';
import { getEvents, Event as EventType } from '@/services/eventService';
import { addDays, endOfMonth, getDay, startOfMonth } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const EventCalendar = () => {
    const [month, setMonth] = useState(new Date());

    const { data: dbEvents = [], isLoading } = useQuery<EventType[]>({
        queryKey: ['db-events'],
        queryFn: getEvents
    });

    const eventDates = useMemo(() => {
        const dates = new Set<string>();
        if (!dbEvents.length) return dates;

        const viewStart = startOfMonth(month);
        const viewEnd = endOfMonth(month);

        dbEvents.forEach(event => {
            if (event.recurring === 'weekly' && event.day_of_week !== null) {
                let day = viewStart;
                while (day <= viewEnd) {
                    if (getDay(day) === event.day_of_week) {
                        dates.add(day.toISOString().split('T')[0]);
                    }
                    day = addDays(day, 1);
                }
            } else if (event.date) {
                // Ensure date is treated as UTC to avoid timezone shifts
                const eventDate = new Date(event.date + "T00:00:00Z");
                if (eventDate >= viewStart && eventDate <= viewEnd) {
                    dates.add(event.date);
                }
            }
        });

        return dates;
    }, [dbEvents, month]);

    const eventDaysForPicker = useMemo(() => {
        return Array.from(eventDates).map(dateStr => {
            const [year, month, day] = dateStr.split('-').map(Number);
            return new Date(Date.UTC(year, month - 1, day));
        });
    }, [eventDates]);

    if (isLoading) {
        return <Skeleton className="h-[365px] w-full max-w-sm rounded-lg" />;
    }

    return (
        <>
            <style>{`
                .day-with-event {
                    position: relative;
                }
                /* Dot indicator for events */
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
                /* Adjust dot color for today's date */
                .day_today.day-with-event::after {
                    background-color: hsl(var(--accent-foreground));
                }
                /* Adjust dot color for selected dates */
                .day_selected.day-with-event::after {
                    background-color: hsl(var(--primary-foreground));
                }
            `}</style>
            <Calendar
                month={month}
                onMonthChange={setMonth}
                modifiers={{ hasEvent: eventDaysForPicker }}
                modifiersClassNames={{ hasEvent: 'day-with-event' }}
                className="rounded-lg border bg-card text-card-foreground shadow-sm"
            />
        </>
    );
};

export default EventCalendar;

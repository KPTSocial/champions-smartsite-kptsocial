
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from '@/components/ui/calendar';
import { CalendarWithEventSlots } from '@/components/ui/calendar-with-event-slots';
import { getEvents, type Event as EventType } from '@/services/eventService';
import { addDays } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import WeeklyCalendarView from './WeeklyCalendarView';

const EventCalendar = () => {
    const [displayDate, setDisplayDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'week'>('month');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const { data: dbEvents = [], isLoading } = useQuery<EventType[]>({
        queryKey: ['db-events'],
        queryFn: getEvents
    });

    const eventDaysForPicker = useMemo(() => {
        const eventDates = new Set<string>();
        if (dbEvents.length > 0) {
            dbEvents.forEach(event => {
                if (event.event_date) {
                    eventDates.add(event.event_date.split('T')[0]);
                }
            });
        }
        
        return Array.from(eventDates).map(dateStr => {
            const [year, month, day] = dateStr.split('-').map(Number);
            return new Date(Date.UTC(year, month - 1, day));
        });
    }, [dbEvents]);

    if (isLoading) {
        return <Skeleton className="h-[430px] w-full max-w-sm rounded-lg" />;
    }
    
    const handlePrevWeek = () => {
        setDisplayDate(prev => addDays(prev, -7));
    }
    
    const handleNextWeek = () => {
        setDisplayDate(prev => addDays(prev, 7));
    }

    const handleAddEvent = () => {
        // This could link to admin dashboard or open a modal
        console.log('Add event clicked');
    };

    return (
        <div className="w-full max-w-sm">
            <div className="flex justify-center gap-2 mb-4">
                <Button variant={view === 'month' ? 'default' : 'outline'} size="sm" onClick={() => setView('month')}>
                    Month
                </Button>
                <Button variant={view === 'week' ? 'default' : 'outline'} size="sm" onClick={() => setView('week')}>
                    Week
                </Button>
            </div>
            {view === 'month' ? (
                <CalendarWithEventSlots
                    events={dbEvents}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    onAddEvent={handleAddEvent}
                />
            ) : (
                <WeeklyCalendarView
                    events={dbEvents}
                    currentDate={displayDate}
                    onPrevWeek={handlePrevWeek}
                    onNextWeek={handleNextWeek}
                />
            )}
        </div>
    );
};

export default EventCalendar;

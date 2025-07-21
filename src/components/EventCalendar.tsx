
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
        }
        
        return Array.from(eventDates).map(dateStr => {
            const [year, month, day] = dateStr.split('-').map(Number);
            // Create local date (not UTC) for calendar display
            return new Date(year, month - 1, day);
        });
    }, [dbEvents]);

    if (isLoading) {
        return <Skeleton className="h-[430px] w-full max-w-lg rounded-lg mx-auto" />;
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
        <div className="w-full max-w-lg mx-auto">
            <div className="flex justify-center gap-3 mb-6">
                <Button 
                    variant={view === 'month' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setView('month')}
                    className="px-6"
                >
                    Month
                </Button>
                <Button 
                    variant={view === 'week' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setView('week')}
                    className="px-6"
                >
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


import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarWithEventSlots } from '@/components/ui/calendar-with-event-slots';
import { getEvents, type Event as EventType } from '@/services/eventService';
import { Skeleton } from '@/components/ui/skeleton';

const EventCalendar = () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const { data: dbEvents = [], isLoading } = useQuery<EventType[]>({
        queryKey: ['db-events'],
        queryFn: getEvents
    });

    if (isLoading) {
        return <Skeleton className="h-[430px] w-full max-w-lg rounded-lg mx-auto" />;
    }

    const handleAddEvent = () => {
        // This could link to admin dashboard or open a modal
        console.log('Add event clicked');
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <CalendarWithEventSlots
                events={dbEvents}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onAddEvent={handleAddEvent}
            />
        </div>
    );
};

export default EventCalendar;

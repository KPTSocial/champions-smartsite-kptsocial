
import React from 'react';
import { format, startOfWeek, addDays, isToday, endOfWeek } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { type Event } from '@/services/eventService';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeeklyCalendarViewProps {
  events: Event[];
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = ({ events, currentDate, onPrevWeek, onNextWeek }) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const eventsByDate = new Map<string, Event[]>();
  events.forEach(event => {
    if(event.event_date) {
        // Convert UTC event date to Pacific Time and get the date part
        const dateKey = formatInTimeZone(new Date(event.event_date), 'America/Los_Angeles', 'yyyy-MM-dd');
        if (!eventsByDate.has(dateKey)) {
            eventsByDate.set(dateKey, []);
        }
        eventsByDate.get(dateKey)?.push(event);
    }
  });

  return (
    <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={onPrevWeek} aria-label="Previous week">
            <ChevronLeft className="h-4 w-4" />
        </Button>
        <p className="text-sm font-medium">{format(weekStart, 'MMM d')} - {format(weekEnd, 'd, yyyy')}</p>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={onNextWeek} aria-label="Next week">
            <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                 <div key={day} className="text-xs font-medium text-muted-foreground">{day}</div>
            ))}
        </div>
        <div className="grid grid-cols-7 mt-2 text-center items-center justify-items-center">
          {weekDays.map(day => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const hasEvent = eventsByDate.has(dayKey);

            return (
                <div key={day.toString()} className="relative h-9 w-9 flex items-center justify-center">
                    <p className={cn(
                        "font-normal w-9 h-9 flex items-center justify-center rounded-full",
                        isToday(day) && "bg-accent text-accent-foreground",
                    )}>
                        {format(day, 'd')}
                    </p>
                    {hasEvent && <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary" />}
                </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyCalendarView;

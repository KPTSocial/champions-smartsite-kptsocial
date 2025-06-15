
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEvents } from '@/services/eventService';
import EventCalendar from '@/components/EventCalendar';
import EventCard from '@/components/EventCard';
import { Skeleton } from '@/components/ui/skeleton';

const Happenings = () => {
  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['allEvents'],
    queryFn: getEvents,
  });

  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold font-serif">Champions Happenings</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            We keep the fun rolling at Champions with weekly and seasonal events that bring the community together. Check out the calendar for a monthly overview or browse all upcoming events below.
          </p>
        </div>

        <section className="mt-16">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-8">
            Event Calendar
          </h2>
          <EventCalendar />
        </section>

        <section className="mt-24">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-12">
            All Upcoming Events
          </h2>
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
            </div>
          )}
          {isError && (
             <div className="text-center text-destructive-foreground bg-destructive p-4 rounded-md">
                <p>Sorry, we couldn't load the events right now. Please try again later.</p>
             </div>
          )}
          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
          ) : (
            !isLoading && <div className="text-center text-muted-foreground bg-card border rounded-lg p-8">
                <p>No upcoming events at the moment. Please check back soon!</p>
            </div>
          )}
        </section>

        <div className="mt-24 bg-secondary/20 p-8 rounded-lg text-center max-w-4xl mx-auto">
            <h3 className="text-2xl font-serif font-semibold text-foreground">Stay Connected!</h3>
            <p className="mt-2 text-muted-foreground">Always check back—new events drop regularly!</p>
            <p className="mt-1 text-muted-foreground">Follow us on social media to stay in the loop on the next big thing!</p>
        </div>

      </div>
    </div>
  );
};

export default Happenings;

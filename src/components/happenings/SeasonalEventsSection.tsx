import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Calendar, MapPin, Phone, ExternalLink, LucideIcon } from 'lucide-react';
import { EventCard } from './EventCard';
import { getEvents, type Event } from '@/services/eventService';
import { getSeasonalCardsPublic, SeasonalEventCard } from '@/services/seasonalCardService';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  calendar: Calendar,
  mail: Mail,
  phone: Phone,
  'external-link': ExternalLink,
};

export function SeasonalEventsSection() {
  // Fetch seasonal cards from database
  const { data: seasonalCards = [], isLoading: cardsLoading } = useQuery<SeasonalEventCard[]>({
    queryKey: ['seasonal-cards-public'],
    queryFn: getSeasonalCardsPublic,
    staleTime: 30 * 1000,
  });

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ['seasonal-sports-events'],
    queryFn: getEvents,
    staleTime: 30 * 1000,
  });

  // Filter for featured sports events (Civil War and other major games)
  const sportsEvents = events.filter(event => 
    event.is_featured && 
    (event.event_type === 'NCAA FB' || event.event_type === 'Soccer') &&
    new Date(event.event_date) >= new Date()
  ).slice(0, 3); // Show top 3 upcoming featured sports events

  // Don't show section if no cards and no sports events
  if (!cardsLoading && seasonalCards.length === 0 && sportsEvents.length === 0) {
    return null;
  }

  return (
    <section className="mt-24">
      <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-12">Seasonal &amp; Special Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto justify-items-center">
        {/* Seasonal Event Cards from Database */}
        {seasonalCards.map(card => (
          <EventCard 
            key={card.id} 
            title={card.title} 
            emoji={card.emoji} 
            description={card.description} 
            details={card.details} 
            cta={{
              text: card.cta_text,
              href: card.cta_href,
              icon: iconMap[card.cta_icon] || Calendar,
              external: card.cta_external,
            }} 
            backgroundImage={card.background_image_url || undefined} 
            className="w-full" 
            style={{
              backgroundPosition: 'center 20%'
            }} 
          />
        ))}
        
        {/* Major Sports Events */}
        {sportsEvents.map(event => (
          <SportsEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

interface SportsEventCardProps {
  event: Event;
}

function SportsEventCard({ event }: SportsEventCardProps) {
  const eventDate = new Date(event.event_date);
  const isHomeGame = event.location?.includes('on-site') || 
                     event.location?.includes('Autzen') || 
                     event.location?.includes('Reser');

  return (
    <div className="relative overflow-hidden rounded-lg bg-card border shadow-lg group hover:shadow-xl transition-shadow">
      {event.image_url && (
        <div className="absolute inset-0">
          <img
            src={event.image_url}
            alt={event.event_title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}
      
      <div className="relative z-10 p-6 text-white min-h-[300px] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              event.event_type === 'NCAA FB' 
                ? 'bg-orange-600 text-white' 
                : 'bg-green-600 text-white'
            }`}>
              {event.event_type}
            </span>
            {isHomeGame && (
              <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-600 text-white">
                HOME
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-bold font-serif mb-2">
            {event.event_title}
          </h3>
          
          <p className="text-white/90 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>

          {event.allow_rsvp && (
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={() => window.location.href = '/reservations'}
            >
              Reserve Your Table
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
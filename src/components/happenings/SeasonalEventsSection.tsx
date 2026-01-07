import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Calendar, MapPin, Phone } from 'lucide-react';
import { EventCard } from './EventCard';
import { getEvents, type Event } from '@/services/eventService';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
const seasonalEvents = [{
  title: "Winter Olympics 2026",
  emoji: "🥇",
  description: "The Winter Olympics are almost here, and Champions is ready for every medal moment. From opening ceremonies to gold-medal finals, this is where Hillsboro gathers to watch the world compete. Table reservations will open soon, so plan ahead and secure your spot.",
  details: ["February 6 - 22, 2026", "Milano Cortina, Italy"],
  cta: {
    text: "Reserve Your Table",
    href: "/reservations",
    icon: Calendar
  },
  backgroundImage: "https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Special%20Events/Wolympics2026.jpeg"
}, {
  title: "Summer Cornhole League",
  emoji: "🏆",
  description: "Swing into summer competition! Our league runs on Sunday afternoons. Games start at 1 PM.",
  details: ["June 22 - July 27, 2025"],
  cta: {
    text: "Email to Join",
    href: "mailto:champions.sportsbar.grill@gmail.com",
    icon: Mail
  },
  backgroundImage: "https://res.cloudinary.com/de3djsvlk/image/upload/v1753120007/summer_cornhole_xbikfm.jpg"
}, {
  title: "Sunday Breakfast & NFL Games",
  emoji: "🏈",
  description: "Join us for Sunday breakfast from 9am-12pm throughout football season! Start your game day right with a hearty breakfast.",
  details: ["Every Sunday during Football Season", "Breakfast: 9am - 12pm", "All Packers games with sound"],
  cta: {
    text: "Call for Game Placement",
    href: "tel:+15037476063",
    icon: Phone
  },
  backgroundImage: "https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Special%20Events/Gemini_Generated_Image_mjg6qomjg6qomjg6.png"
}, {
  title: "FIFA World Cup 2026",
  emoji: "⚽",
  description: "The FIFA World Cup is coming, and Champions is where the world meets in Hillsboro. Every match. Every goal. Every unforgettable moment. Planning to watch with a group? World Cup table reservations open soon. Claim your spot early and be part of the action.",
  details: ["June 11 - July 19, 2026", "All matches shown live"],
  cta: {
    text: "Reserve Your Table",
    href: "/reservations",
    icon: Calendar
  },
  backgroundImage: "https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Special%20Events/FIFA2026.jpeg"
}];
export function SeasonalEventsSection() {
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

  return (
    <section className="mt-24">
      <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-12">Seasonal &amp; Special Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto justify-items-center">
        {/* Summer Cornhole League */}
        {seasonalEvents.map(event => (
          <EventCard 
            key={event.title} 
            title={event.title} 
            emoji={event.emoji} 
            description={event.description} 
            details={event.details} 
            cta={event.cta} 
            backgroundImage={event.backgroundImage} 
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
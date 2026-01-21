import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { EventCard } from './EventCard';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

// Fetch upcoming Bingo events from database
const fetchBingoEvents = async () => {
  const today = new Date().toISOString();
  const { data, error } = await supabase
    .from('events')
    .select('event_date, event_title')
    .ilike('event_title', '%bingo%')
    .eq('status', 'published')
    .gte('event_date', today)
    .order('event_date', { ascending: true })
    .limit(6);

  if (error) {
    console.error('Error fetching bingo events:', error);
    return [];
  }
  return data || [];
};

// Format bingo dates by month (e.g., "January: 7th & 21st")
const formatBingoDates = (events: { event_date: string; event_title: string }[]) => {
  if (!events || events.length === 0) return ["Check back for upcoming dates!"];

  // Group events by month
  const monthGroups: Record<string, number[]> = {};
  
  events.forEach(event => {
    const date = parseISO(event.event_date);
    const monthName = format(date, 'MMMM');
    const dayNum = parseInt(format(date, 'd'), 10);
    
    if (!monthGroups[monthName]) {
      monthGroups[monthName] = [];
    }
    monthGroups[monthName].push(dayNum);
  });

  // Format each month's dates
  return Object.entries(monthGroups).map(([month, days]) => {
    const sortedDays = days.sort((a, b) => a - b);
    const formattedDays = sortedDays.map(day => {
      const suffix = day === 1 || day === 21 || day === 31 ? 'st' 
        : day === 2 || day === 22 ? 'nd' 
        : day === 3 || day === 23 ? 'rd' 
        : 'th';
      return `${day}${suffix}`;
    });
    
    if (formattedDays.length === 1) {
      return `${month}: ${formattedDays[0]}`;
    } else if (formattedDays.length === 2) {
      return `${month}: ${formattedDays[0]} & ${formattedDays[1]}`;
    } else {
      const last = formattedDays.pop();
      return `${month}: ${formattedDays.join(', ')} & ${last}`;
    }
  });
};

export function RecurringEventsSection() {
  const { data: bingoEvents } = useQuery({
    queryKey: ['bingo-events'],
    queryFn: fetchBingoEvents,
    staleTime: 10000, // 10 seconds - match EventCalendar for consistency
    refetchOnMount: true,
  });

  const bingoDates = formatBingoDates(bingoEvents || []);

  const recurringEvents = [
    {
      title: "Taco Tuesdays",
      emoji: "🌮",
      description: "All day tacos including soft shell with your choice of ground beef or shredded chicken, plus Mexican beer and margarita specials. Every Tuesday.",
      cta: {
        text: "View Menu",
        href: "/menu",
        external: false
      },
      backgroundImage: "https://res.cloudinary.com/de3djsvlk/image/upload/v1753117392/taco_tuesday_card_gyrc53.jpg"
    },
    {
      title: "Trivia Night",
      emoji: "🧠",
      description: "Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts! Call ahead for groups of 5+.",
      ctas: [
        {
          text: "Learn More",
          href: "https://www.lastcalltrivia.com/",
          external: true
        },
        {
          text: "Reserve a Spot",
          href: "/reservations",
          external: false
        }
      ],
      backgroundImage: "https://res.cloudinary.com/de3djsvlk/image/upload/v1753118533/trivia_night_image_r6s7vy.jpg"
    },
    {
      title: "Bingo Night",
      emoji: "🍻",
      description: "Bingo with a twist—hosted by local breweries, wineries, or distilleries. Seats fill fast! Call ahead for groups of 5+.",
      details: bingoDates,
      cta: {
        text: "Reserve a Spot",
        href: "/reservations",
        external: false
      },
      backgroundImage: "https://res.cloudinary.com/de3djsvlk/image/upload/v1753118240/A7305176_vrkjug.jpg"
    }
  ];

  return (
    <section className="mt-16">
      <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-12 speakable-content">Recurring Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recurringEvents.map(event => (
          <EventCard
            key={event.title}
            title={event.title}
            emoji={event.emoji}
            description={event.description}
            details={event.details}
            cta={event.cta}
            ctas={event.ctas}
            backgroundImage={event.backgroundImage}
          />
        ))}
      </div>
    </section>
  );
}

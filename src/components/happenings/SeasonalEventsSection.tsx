import React from 'react';
import { Mail } from 'lucide-react';
import { EventCard } from './EventCard';
const seasonalEvents = [{
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
}];
export function SeasonalEventsSection() {
  return <section className="mt-24">
      <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-12">Seasonal &amp; Special Events</h2>
      <div className="flex justify-center">
        {seasonalEvents.map(event => <EventCard key={event.title} title={event.title} emoji={event.emoji} description={event.description} details={event.details} cta={event.cta} backgroundImage={event.backgroundImage} className="max-w-3xl w-full" style={{
        backgroundPosition: 'center 20%'
      }} />)}
      </div>
    </section>;
}
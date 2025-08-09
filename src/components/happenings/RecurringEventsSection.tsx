import React from 'react';
import { EventCard } from './EventCard';
const recurringEvents = [{
  title: "Taco Tuesdays",
  emoji: "🌮",
  description: "All-day tacos & Mexican beer specials. Choose from ground beef or shredded chicken, and pair with a cold one. Every Tuesday.",
  cta: {
    text: "View Menu",
    href: "/menu",
    external: false
  },
  backgroundImage: "https://res.cloudinary.com/de3djsvlk/image/upload/v1753117392/taco_tuesday_card_gyrc53.jpg"
}, {
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
}, {
  title: "Bingo Night",
  emoji: "🍻",
  description: "Bingo with a twist—hosted by local breweries, wineries, or distilleries. Seats fill fast! Call ahead for groups of 5+.",
  details: ["August: 20th", "September: 3rd & 17th", "October: 1st, 15th & 29th", "November: 12th"],
  cta: {
    text: "Reserve a Spot",
    href: "/reservations",
    external: false
  },
  backgroundImage: "https://res.cloudinary.com/de3djsvlk/image/upload/v1753118240/A7305176_vrkjug.jpg"
}];
export function RecurringEventsSection() {
  return <section className="mt-16">
      <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-12">Recurring Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recurringEvents.map(event => <EventCard key={event.title} title={event.title} emoji={event.emoji} description={event.description} details={event.details} cta={event.cta} ctas={event.ctas} backgroundImage={event.backgroundImage} />)}
      </div>
    </section>;
}
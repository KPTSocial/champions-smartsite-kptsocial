import React from 'react';
import EventCalendar from '@/components/EventCalendar';
import { BackgroundContainer } from '@/components/ui/background-container';
import { PageHeader } from '@/components/ui/page-header';
import { RecurringEventsSection } from '@/components/happenings/RecurringEventsSection';
import { SeasonalEventsSection } from '@/components/happenings/SeasonalEventsSection';
import { SportsEventsSection } from '@/components/happenings/SportsEventsSection';
const Happenings = () => {
  return <BackgroundContainer backgroundImage="https://res.cloudinary.com/de3djsvlk/image/upload/v1753119005/A7304962_psfeqt.jpg" className="py-16 md:py-24" grayscale={true}>
      <PageHeader title="Champions Happenings" description="We keep the fun rolling at Champions with weekly and seasonal events that bring the community together. Here's what's live right now:" />

      <section className="mt-16">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-12">Event Calendar</h2>
        <div className="flex justify-center">
          <EventCalendar />
        </div>
      </section>

      <SportsEventsSection />
      <RecurringEventsSection />
      <SeasonalEventsSection />

      <div className="mt-24 bg-secondary/20 p-8 rounded-lg text-center max-w-4xl mx-auto">
        <h3 className="text-2xl font-serif font-semibold text-foreground">Stay Connected!</h3>
        <p className="mt-2 text-muted-foreground">Always check back—new events drop regularly!</p>
        <p className="mt-1 text-muted-foreground">Follow us on social media to stay in the loop on the next big thing!</p>
      </div>
    </BackgroundContainer>;
};
export default Happenings;
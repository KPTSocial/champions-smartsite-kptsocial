import { AlertTriangle } from 'lucide-react';
import { useClosureEvents } from '@/hooks/useClosureEvents';
import { formatInTimeZone } from 'date-fns-tz';
import { motion } from 'framer-motion';

const HomepageAlertBanner = () => {
  const { data: bannerEvents, isLoading } = useClosureEvents();

  // Don't render anything if no banner events
  if (isLoading || !bannerEvents || bannerEvents.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-amber-500/10 border-y border-amber-500/30">
      <div className="container px-4 py-6 md:py-8">
        {bannerEvents.map((event) => {
          // Format date in Pacific Time to match calendar display
          const formattedDate = formatInTimeZone(
            new Date(event.event_date),
            'America/Los_Angeles',
            'EEEE, MMMM d, yyyy'
          );

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 shrink-0" />
                <h2 className="text-lg md:text-xl font-semibold">
                  {event.event_title}
                </h2>
              </div>
              
              <p className="text-amber-700 font-medium text-base md:text-lg">
                {formattedDate}
              </p>
              
              {event.description && (
                <p className="text-amber-700/80 max-w-2xl text-sm md:text-base">
                  {event.description}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default HomepageAlertBanner;

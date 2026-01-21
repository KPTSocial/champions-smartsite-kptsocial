import React from 'react';
import { BUSINESS_DATA } from '@/lib/seo-constants';

interface RecurringEvent {
  name: string;
  description: string;
  dayOfWeek: string;
  startTime: string;
  endTime?: string;
  frequency: string;
}

interface RecurringEventSchemaProps {
  event: RecurringEvent;
}

export const RecurringEventSchema: React.FC<RecurringEventSchemaProps> = ({ event }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    "name": event.name,
    "description": event.description,
    "eventSchedule": {
      "@type": "Schedule",
      "repeatFrequency": event.frequency,
      "byDay": `http://schema.org/${event.dayOfWeek}`,
      "startTime": event.startTime,
      ...(event.endTime && { "endTime": event.endTime })
    },
    "location": {
      "@type": "BarOrPub",
      "name": BUSINESS_DATA.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": BUSINESS_DATA.streetAddress,
        "addressLocality": BUSINESS_DATA.addressLocality,
        "addressRegion": BUSINESS_DATA.addressRegion,
        "postalCode": BUSINESS_DATA.postalCode
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": BUSINESS_DATA.name,
      "url": BUSINESS_DATA.url
    },
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// Component to render all recurring events
export const AllRecurringEventsSchema: React.FC = () => {
  return (
    <>
      {BUSINESS_DATA.recurringEvents.map((event, index) => (
        <RecurringEventSchema key={index} event={event} />
      ))}
    </>
  );
};

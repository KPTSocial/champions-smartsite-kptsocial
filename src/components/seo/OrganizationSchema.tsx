import React from 'react';
import { BUSINESS_DATA } from '@/lib/seo-constants';

export const OrganizationSchema: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "BarOrPub", "SportsActivityLocation"],
    "@id": `${BUSINESS_DATA.url}#organization`,
    "name": BUSINESS_DATA.name,
    "alternateName": BUSINESS_DATA.alternateName,
    "url": BUSINESS_DATA.url,
    "logo": {
      "@type": "ImageObject",
      "url": BUSINESS_DATA.logo,
      "contentUrl": BUSINESS_DATA.logo,
      "caption": `${BUSINESS_DATA.name} Logo`
    },
    "image": BUSINESS_DATA.images,
    "telephone": BUSINESS_DATA.telephone,
    "email": BUSINESS_DATA.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS_DATA.streetAddress,
      "addressLocality": BUSINESS_DATA.addressLocality,
      "addressRegion": BUSINESS_DATA.addressRegion,
      "postalCode": BUSINESS_DATA.postalCode,
      "addressCountry": BUSINESS_DATA.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": BUSINESS_DATA.latitude,
      "longitude": BUSINESS_DATA.longitude
    },
    "hasMap": `https://www.google.com/maps/place/${encodeURIComponent(`${BUSINESS_DATA.streetAddress}, ${BUSINESS_DATA.addressLocality}, ${BUSINESS_DATA.addressRegion} ${BUSINESS_DATA.postalCode}`)}`,
    "openingHoursSpecification": Object.entries(BUSINESS_DATA.hours).map(([day, hours]) => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": `https://schema.org/${day.charAt(0).toUpperCase() + day.slice(1)}`,
      "opens": hours.opens,
      "closes": hours.closes
    })),
    "priceRange": BUSINESS_DATA.priceRange,
    "servesCuisine": BUSINESS_DATA.cuisineTypes,
    "acceptsReservations": BUSINESS_DATA.acceptsReservations,
    "menu": `${BUSINESS_DATA.url}/menu`,
    "paymentAccepted": BUSINESS_DATA.paymentMethods.join(", "),
    "currenciesAccepted": "USD",
    "amenityFeature": BUSINESS_DATA.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity,
      "value": true
    })),
    "knowsAbout": BUSINESS_DATA.knowledgeTopics,
    "sameAs": Object.values(BUSINESS_DATA.social),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Champions Daily Specials & Events",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Daily Happy Hour",
            "description": `Daily drink and food specials from ${BUSINESS_DATA.happyHour.startDisplay} to ${BUSINESS_DATA.happyHour.endDisplay} every day`
          },
          "availabilityStarts": BUSINESS_DATA.happyHour.start,
          "availabilityEnds": BUSINESS_DATA.happyHour.end
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

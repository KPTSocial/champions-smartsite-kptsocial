import React from 'react';

interface SpeakableSchemaProps {
  headline: string;
  description: string;
  cssSelectors?: string[];
}

export const SpeakableSchema: React.FC<SpeakableSchemaProps> = ({
  headline,
  description,
  cssSelectors = ['.speakable-content']
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": headline,
    "description": description,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": cssSelectors
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

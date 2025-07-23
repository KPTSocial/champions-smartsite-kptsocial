import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventCta {
  text: string;
  href: string;
  external?: boolean;
  icon?: LucideIcon;
}

interface EventCardProps {
  title: string;
  emoji: string;
  description: string;
  details?: string[];
  cta?: EventCta;
  backgroundImage?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function EventCard({
  title,
  emoji,
  description,
  details,
  cta,
  backgroundImage,
  className = "",
  style = {}
}: EventCardProps) {
  const hasBackground = !!backgroundImage;

  return (
    <Card 
      className={`flex flex-col border-border/60 hover:border-primary/80 transition-all duration-300 hover:shadow-lg relative overflow-hidden ${
        hasBackground ? "bg-cover bg-center bg-no-repeat" : ""
      } ${className}`}
      style={
        hasBackground
          ? {
              backgroundImage: `url(${backgroundImage})`,
              filter: 'grayscale(50%)',
              ...style,
            }
          : style
      }
    >
      {hasBackground && (
        <div className="absolute inset-0 bg-background/75 backdrop-blur-[1px]" />
      )}
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-4 text-2xl">
          <span className="text-4xl">{emoji}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col relative z-10">
        <p className="text-muted-foreground flex-grow">{description}</p>
        {details && (
          <div className="mt-4 space-y-2">
            {title.includes("Cornhole") ? (
              <ul className="space-y-1 text-muted-foreground">
                {details.map(detail => (
                  <li key={detail} className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <h4 className="font-semibold text-foreground">Next Sessions:</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  {details.map(date => <li key={date}>{date}</li>)}
                </ul>
              </>
            )}
          </div>
        )}
        {cta && (
          <Button asChild className="mt-6 w-full">
            {cta.external ? (
              <a href={cta.href} target="_blank" rel="noopener noreferrer">
                {cta.icon && <cta.icon className="mr-2 h-4 w-4" />}
                {cta.text}
              </a>
            ) : (
              <Link to={cta.href}>
                {cta.icon && <cta.icon className="mr-2 h-4 w-4" />}
                {cta.text}
              </Link>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
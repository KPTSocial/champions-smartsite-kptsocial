
import React from 'react';
import { TEvent } from '@/types/events';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { CalendarDays, ExternalLink, Mail, Ticket } from 'lucide-react';

const eventTypeEmojis: Record<string, string> = {
    'Game Night': '🏆',
    'Specials': '🌮',
    'Live Music': '🎸',
};

const EventCard = ({ event }: { event: TEvent }) => {
    const isExternal = event.rsvp_link?.startsWith('http') ?? false;
    const isMail = event.rsvp_link?.startsWith('mailto:') ?? false;
    const emoji = eventTypeEmojis[event.event_type] || '🎉';

    const renderButton = () => {
        if (!event.allow_rsvp || !event.rsvp_link) return null;

        let icon = <Ticket className="mr-2 h-4 w-4" />;
        if (isMail) icon = <Mail className="mr-2 h-4 w-4" />;
        if (isExternal) icon = <ExternalLink className="mr-2 h-4 w-4" />;

        const linkProps = {
            href: event.rsvp_link,
            ...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })
        };
        
        const ctaTextMap: Record<string, string> = {
            'mailto:champions.sportsbar.grill@gmail.com': 'Email to Join',
            'https://www.lastcalltrivia.com/': 'Learn More',
            '/reservations': 'Reserve a Spot',
            '/menu': 'View Menu'
        }
        
        const ctaText = ctaTextMap[event.rsvp_link] || 'RSVP';

        return (
            <Button asChild className="mt-6 w-full">
                {isExternal || isMail ? (
                    <a {...linkProps}>{icon}{ctaText}</a>
                ) : (
                    <Link to={event.rsvp_link}>{icon}{ctaText}</Link>
                )}
            </Button>
        );
    };

    return (
        <Card className="flex flex-col border-border/60 hover:border-primary/80 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-4 text-2xl">
                    <span className="text-4xl">{emoji}</span>
                    {event.event_title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <span>{format(parseISO(event.event_date), "EEEE, MMMM do 'at' p")}</span>
                </div>
                <p className="text-muted-foreground flex-grow">{event.description}</p>
                {renderButton()}
            </CardContent>
        </Card>
    );
};

export default EventCard;

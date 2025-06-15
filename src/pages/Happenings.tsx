import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventCalendar from '@/components/EventCalendar';

const recurringEvents = [
  {
    title: "Taco Tuesdays",
    emoji: "🌮",
    description: "All-day tacos & Mexican beer specials. Choose from ground beef, shredded chicken, carnitas, or mahi mahi, and pair with a cold one. Every Tuesday.",
    cta: {
      text: "View Menu",
      href: "/menu",
      external: false,
    },
  },
  {
    title: "Trivia Night",
    emoji: "🧠",
    description: "Flex those brain muscles every Tuesday at 6 PM—hosted by Last Call Trivia. Gather your crew and show off your smarts!",
    cta: {
        text: "Learn More",
        href: "https://www.lastcalltrivia.com/",
        external: true,
    }
  },
  {
    title: "Bingo Night",
    emoji: "🍻",
    description: "Bingo with a twist—hosted by local breweries, wineries, or distilleries. Seats fill fast! Call ahead for groups of 6+.",
    details: [
      "June: 11th & 25th",
      "July: 9th & 23rd",
    ],
    cta: {
      text: "Reserve a Spot",
      href: "/reservations",
      external: false,
    },
  },
];

const seasonalEvents = [
    {
        title: "Summer Cornhole League",
        emoji: "🏆",
        description: "Swing into summer competition! Our league runs on Sunday afternoons. Games start at 1 PM.",
        details: ["June 22 - July 27, 2025"],
        cta: {
            text: "Email to Join",
            href: "mailto:champions.sportsbar.grill@gmail.com",
            icon: Mail
        }
    }
]

const Happenings = () => {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold font-serif">Champions Happenings</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            We keep the fun rolling at Champions with weekly and seasonal events that bring the community together. Here’s what’s live right now:
          </p>
        </div>

        <section className="mt-16">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-12">
            📅 Event Calendar
          </h2>
          <div className="flex justify-center">
            <EventCalendar />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-12">
            🔥 Recurring Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recurringEvents.map((event) => (
              <Card key={event.title} className="flex flex-col border-border/60 hover:border-primary/80 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4 text-2xl">
                    <span className="text-4xl">{event.emoji}</span>
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                    <p className="text-muted-foreground flex-grow">{event.description}</p>
                    {event.details && (
                        <div className="mt-4 space-y-2">
                            <h4 className="font-semibold text-foreground">Next Sessions:</h4>
                            <ul className="list-disc list-inside text-muted-foreground">
                                {event.details.map(date => <li key={date}>{date}</li>)}
                            </ul>
                        </div>
                    )}
                    {event.cta && (
                         <Button asChild className="mt-6 w-full">
                            {event.cta.external ? 
                                <a href={event.cta.href} target="_blank" rel="noopener noreferrer">{event.cta.text}</a> :
                                <Link to={event.cta.href}>{event.cta.text}</Link>
                            }
                        </Button>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-12">
            🏆 Seasonal & Special Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             {seasonalEvents.map((event) => (
              <Card key={event.title} className="flex flex-col border-border/60 hover:border-primary/80 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4 text-2xl">
                     <span className="text-4xl">{event.emoji}</span>
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                    <p className="text-muted-foreground flex-grow">{event.description}</p>
                    {event.details && (
                        <div className="mt-4 space-y-2">
                            <ul className="space-y-1 text-muted-foreground">
                                {event.details.map(detail => <li key={detail} className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary flex-shrink-0" /> {detail}</li>)}
                            </ul>
                        </div>
                    )}
                    {event.cta && (
                         <Button asChild className="mt-6 w-full">
                            <a href={event.cta.href}>
                                {event.cta.icon && <event.cta.icon className="mr-2 h-4 w-4" />}
                                {event.cta.text}
                            </a>
                        </Button>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="mt-24 bg-secondary/20 p-8 rounded-lg text-center max-w-4xl mx-auto">
            <h3 className="text-2xl font-serif font-semibold text-foreground">Stay Connected!</h3>
            <p className="mt-2 text-muted-foreground">Always check back—new events drop regularly!</p>
            <p className="mt-1 text-muted-foreground">Follow us on social media to stay in the loop on the next big thing!</p>
        </div>

      </div>
    </div>
  );
};

export default Happenings;

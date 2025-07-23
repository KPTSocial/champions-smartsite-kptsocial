import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Eye } from 'lucide-react';
import { Event } from '@/services/eventService';

interface EventsStatsProps {
  events: Event[];
}

const EventsStats: React.FC<EventsStatsProps> = ({ events }) => {
  const totalEvents = events.length;
  const publishedEvents = events.filter(e => e.status === 'published').length;
  const draftEvents = events.filter(e => e.status === 'draft').length;
  const upcomingEvents = events.filter(e => 
    new Date(e.event_date) > new Date() && e.status === 'published'
  ).length;

  const stats = [
    {
      title: "Total Events",
      value: totalEvents,
      icon: Calendar,
      description: "All events in system"
    },
    {
      title: "Published",
      value: publishedEvents,
      icon: Eye,
      description: "Live on public calendar"
    },
    {
      title: "Drafts",
      value: draftEvents,
      icon: Clock,
      description: "Pending publication"
    },
    {
      title: "Upcoming",
      value: upcomingEvents,
      icon: MapPin,
      description: "Future published events"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EventsStats;
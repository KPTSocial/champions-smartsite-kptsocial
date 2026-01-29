import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Filter, MapPin, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/services/eventService';
import EventsStats from './EventsStats';
import EventsFilters from './EventsFilters';
import EventForm from './EventForm';
import EventCalendarAdmin from './EventCalendarAdmin';
import { SeasonalCardsManager } from './SeasonalCardsManager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
const EventsDashboard: React.FC = () => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    location: 'all',
    dateRange: 'all'
  });
  
  const { toast } = useToast();

  // Fetch all events (admin can see drafts and published)
  const { data: events = [], refetch: refetchEvents, isLoading } = useQuery({
    queryKey: ['admin-events', filters],
    queryFn: async () => {
      let query = supabase.from('events').select('*');
      
      // Apply filters
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.type !== 'all') {
        query = query.eq('event_type', filters.type as 'Live Music' | 'Game Night' | 'Specials');
      }
      if (filters.location !== 'all') {
        query = query.eq('location', filters.location);
      }
      
      query = query.order('event_date', { ascending: true });
      
      const { data, error } = await query;
      if (error) {
        console.error("Error fetching admin events:", error);
        return [];
      }
      return data || [];
    },
  });

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const handleEventFormClose = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
    refetchEvents();
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      });
      
      refetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete the event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePublishEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'published' })
        .eq('id', eventId);

      if (error) throw error;
      
      toast({
        title: "Event published",
        description: "The event is now live on the public calendar.",
      });
      
      refetchEvents();
    } catch (error) {
      console.error('Error publishing event:', error);
      toast({
        title: "Error",
        description: "Failed to publish the event. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events Management</h1>
          <p className="text-muted-foreground">
            Manage happenings calendar events and publish to the live site
          </p>
        </div>
        <Button onClick={handleCreateEvent} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Stats */}
      <EventsStats events={events} />

      {/* Filters and View Toggle */}
      <div className="flex items-center justify-between gap-4">
        <EventsFilters filters={filters} onFiltersChange={setFilters} />
        
        <div className="flex gap-2">
          <Button
            variant={view === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('calendar')}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Calendar
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {view === 'calendar' ? (
        <EventCalendarAdmin
          events={events}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          onPublishEvent={handlePublishEvent}
          onCreateEvent={handleCreateEvent}
          statusFilter={filters.status}
        />
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {event.event_title}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        event.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : event.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.event_type}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                    >
                      Edit
                    </Button>
                    {event.status === 'draft' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handlePublishEvent(event.id)}
                      >
                        Publish
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {event.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
          {events.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first event
                </p>
                <Button onClick={handleCreateEvent}>Create Event</Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Seasonal & Special Event Cards Section */}
      <SeasonalCardsManager />

      {/* Event Form Dialog */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            event={selectedEvent}
            onClose={handleEventFormClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsDashboard;
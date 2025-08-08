// EventCalendarAdmin - Calendar interface for admin events management
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/services/eventService';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Edit, Trash2, Eye, MapPin, Clock } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface EventCalendarAdminProps {
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onPublishEvent: (eventId: string) => void;
  onCreateEvent: () => void;
}

const EventCalendarAdmin: React.FC<EventCalendarAdminProps> = ({ 
  events, 
  onEditEvent, 
  onDeleteEvent, 
  onPublishEvent, 
  onCreateEvent 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  // Get events for the selected date
  const eventsForSelectedDate = events.filter(event =>
    isSameDay(new Date(event.event_date), selectedDate)
  );

  // Get all dates that have events for calendar highlighting
  const eventDays = events.map(event => new Date(event.event_date));

  const formatEventTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const pacificTime = formatInTimeZone(date, 'America/Los_Angeles', 'h:mm a');
      
      // Special case for Taco Tuesday
      if (dateString.includes('Taco Tuesday')) {
        return 'All Day';
      }
      
      return pacificTime;
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Time TBD';
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'archived':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const handleDeleteClick = (eventId: string) => {
    setDeleteEventId(eventId);
  };

  const handleDeleteConfirm = () => {
    if (deleteEventId) {
      onDeleteEvent(deleteEventId);
      setDeleteEventId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Section */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Events Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              modifiers={{
                hasEvents: eventDays
              }}
              modifiersStyles={{
                hasEvents: {
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  color: 'hsl(var(--primary))',
                  fontWeight: 'bold'
                }
              }}
              className="w-full"
            />
            <div className="mt-4 text-center">
              <Button onClick={onCreateEvent} className="gap-2">
                <Plus className="h-4 w-4" />
                Create New Event
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events for Selected Date */}
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsForSelectedDate.length === 0 ? (
              <div className="text-center py-12">
                <Plus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-6 text-base">No events scheduled for this date</p>
                <Button
                  variant="outline"
                  onClick={onCreateEvent}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {eventsForSelectedDate.map((event) => (
                  <div 
                    key={event.id} 
                    className="p-4 border rounded-lg hover:bg-muted/20 transition-colors"
                  >
                    {/* Header with title and status */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="font-medium text-foreground leading-tight">
                        {event.event_title}
                      </h3>
                      <Badge variant={getStatusVariant(event.status || 'published')} className="shrink-0">
                        {(event.status || 'published').charAt(0).toUpperCase() + (event.status || 'published').slice(1)}
                      </Badge>
                    </div>

                    {/* Event details */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatEventTime(event.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="capitalize">{event.location || 'on-site'}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    {/* Sub-event indicator */}
                    {event.parent_event_id && (
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          Related Event
                        </Badge>
                        <span className="text-xs text-muted-foreground">Auto-generated from recurring event</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditEvent(event)}
                        className="h-8"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                      </Button>
                      
                      {event.status === 'draft' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onPublishEvent(event.id)}
                          className="h-8"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1.5" />
                          Publish
                        </Button>
                      )}
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(event.id)}
                        className="h-8 ml-auto"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Legend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Status Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-primary/20 border-2 border-primary/40"></div>
              <span className="text-sm text-muted-foreground">Calendar days with scheduled events</span>
            </div>
            
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center gap-3">
                <Badge variant="default">Published</Badge>
                <span className="text-sm text-muted-foreground">Visible on public calendar</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Draft</Badge>
                <span className="text-sm text-muted-foreground">Saved but not yet published</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="destructive">Cancelled</Badge>
                <span className="text-sm text-muted-foreground">Event cancelled</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">Related Event</Badge>
                <span className="text-sm text-muted-foreground">Auto-generated from recurring events</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteEventId} onOpenChange={() => setDeleteEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
              If this event has sub-events (like Trivia Night), they will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventCalendarAdmin;
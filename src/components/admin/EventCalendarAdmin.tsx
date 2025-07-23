import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/services/eventService';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2, Eye, MapPin, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
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
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
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
            <div className="flex items-center justify-between">
              <CardTitle>Events Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-32 text-center">
                  {format(currentMonth, 'MMMM yyyy')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
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
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsForSelectedDate.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No events scheduled for this date</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCreateEvent}
                  className="gap-2"
                >
                  <Plus className="h-3 w-3" />
                  Add Event
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {eventsForSelectedDate.map((event) => (
                  <Card key={event.id} className="relative">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-sm">{event.event_title}</h3>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatEventTime(event.event_date)}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                            </div>
                          </div>
                          <Badge className={`text-xs ${getStatusColor(event.status || 'published')}`}>
                            {event.status || 'published'}
                          </Badge>
                        </div>

                        {event.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditEvent(event)}
                            className="h-7 px-2 gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                          
                          {event.status === 'draft' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => onPublishEvent(event.id)}
                              className="h-7 px-2 gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Publish
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(event.id)}
                            className="h-7 px-2 gap-1 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>

                        {event.parent_event_id && (
                          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            🔗 Sub-event of main event
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded bg-primary/20 border border-primary/30"></div>
              <span>Days with events</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <Badge className={`text-xs ${getStatusColor('published')}`}>Published</Badge>
                <span>Live on public calendar</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Badge className={`text-xs ${getStatusColor('draft')}`}>Draft</Badge>
                <span>Not yet published</span>
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
// EventCalendarAdmin - Calendar interface for admin events management
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/services/eventService';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Edit, Trash2, Eye, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
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
  statusFilter?: string;
}

const ITEMS_PER_PAGE = 10;

const EventCalendarAdmin: React.FC<EventCalendarAdminProps> = ({ 
  events, 
  onEditEvent, 
  onDeleteEvent, 
  onPublishEvent, 
  onCreateEvent,
  statusFilter = 'all'
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [filteredPage, setFilteredPage] = useState(1);

  // Reset page when filter changes
  useEffect(() => {
    setFilteredPage(1);
  }, [statusFilter]);

  // Check if we should show the filtered events list
  const showFilteredList = statusFilter === 'draft' || 
                           statusFilter === 'cancelled' || 
                           statusFilter === 'archived';

  // Get filtered events for the sidebar list
  const filteredStatusEvents = showFilteredList 
    ? events
        .filter(e => e.status === statusFilter)
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    : [];

  const totalPages = Math.ceil(filteredStatusEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = filteredStatusEvents.slice(
    (filteredPage - 1) * ITEMS_PER_PAGE,
    filteredPage * ITEMS_PER_PAGE
  );

  // Get events for the selected date
  const eventsForSelectedDate = events.filter(event =>
    isSameDay(new Date(event.event_date), selectedDate)
  );

  // Get all dates that have events for calendar highlighting
  const eventDays = events.map(event => new Date(event.event_date));

  const formatEventTime = (dateString: string, eventTitle?: string) => {
    try {
      // Special handling for Taco Tuesday - show full business hours
      if (eventTitle && eventTitle.toLowerCase().includes('taco tuesday')) {
        return '11:00 AM - 10:00 PM PT';
      }

      // Portland Thorns games are currently stored 3 hours ahead — adjust display only
      const isThorns = eventTitle?.toLowerCase().includes('thorns') ?? false;
      let date = new Date(dateString);
      if (isThorns) {
        date = new Date(date.getTime() - 3 * 60 * 60 * 1000);
      }

      // Convert to Pacific Time and format with consistent AM/PM capitalization
      const timeStr = formatInTimeZone(date, 'America/Los_Angeles', 'h:mm a');
      return timeStr.toUpperCase() + ' PT';
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      {/* Calendar Section */}
      <div className="lg:col-span-2 order-2 lg:order-1">
        <Card>
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-lg md:text-xl">Events Calendar</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            <div className="overflow-x-auto">
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
                className="w-full mx-auto"
              />
            </div>
            <div className="mt-4 text-center">
              <Button onClick={onCreateEvent} className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create New Event</span>
                <span className="sm:hidden">New Event</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events for Selected Date */}
      <div className="space-y-4 lg:space-y-6 order-1 lg:order-2">
        <Card>
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-base md:text-lg">
              {format(selectedDate, 'EEE, MMM d')}
              <span className="hidden md:inline">{format(selectedDate, ', yyyy')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
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

                    {/* Sponsor & Theme badges */}
                    {((event as any).sponsored_by || (event as any).theme) && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(event as any).sponsored_by && (
                          <Badge variant="outline" className="text-xs bg-primary/10">
                            🍺 {(event as any).sponsored_by}
                          </Badge>
                        )}
                        {(event as any).theme && (
                          <Badge variant="outline" className="text-xs bg-accent/10">
                            ✨ {(event as any).theme}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Event details */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatEventTime(event.event_date, event.event_title)}</span>
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditEvent(event)}
                        className="h-7 md:h-8 text-xs md:text-sm"
                      >
                        <Edit className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 md:mr-1.5" />
                        Edit
                      </Button>
                      
                      {event.status === 'draft' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onPublishEvent(event.id)}
                          className="h-7 md:h-8 text-xs md:text-sm"
                        >
                          <Eye className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 md:mr-1.5" />
                          Publish
                        </Button>
                      )}
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(event.id)}
                        className="h-7 md:h-8 ml-auto text-xs md:text-sm"
                      >
                        <Trash2 className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 md:mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filtered Events List - Shows when Draft/Cancelled/Archived filter is active */}
        {showFilteredList && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base capitalize flex items-center justify-between">
                <span>{statusFilter} Events ({filteredStatusEvents.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {paginatedEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No {statusFilter} events found
                </p>
              ) : (
                <>
                  {paginatedEvents.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-sm">{event.event_title}</h4>
                        <Badge variant={getStatusVariant(event.status || 'draft')} className="shrink-0 text-xs">
                          {event.status}
                        </Badge>
                      </div>
                      {/* Sponsor & Theme badges in filtered list */}
                      {((event as any).sponsored_by || (event as any).theme) && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {(event as any).sponsored_by && (
                            <Badge variant="outline" className="text-xs bg-primary/10">
                              🍺 {(event as any).sponsored_by}
                            </Badge>
                          )}
                          {(event as any).theme && (
                            <Badge variant="outline" className="text-xs bg-accent/10">
                              ✨ {(event as any).theme}
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span>{format(new Date(event.event_date), 'MMM d, yyyy')}</span>
                        <span>•</span>
                        <span>{event.event_type}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => onEditEvent(event)}>
                          Edit
                        </Button>
                        {event.status === 'draft' && (
                          <Button size="sm" className="h-7 text-xs" onClick={() => onPublishEvent(event.id)}>
                            Publish
                          </Button>
                        )}
                        <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={() => handleDeleteClick(event.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setFilteredPage(p => Math.max(1, p - 1))}
                        disabled={filteredPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {filteredPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setFilteredPage(p => Math.min(totalPages, p + 1))}
                        disabled={filteredPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Enhanced Legend - Hidden on Mobile */}
        <Card className="hidden lg:block">
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
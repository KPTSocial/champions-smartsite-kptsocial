import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Calendar, Search, Filter, MapPin, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/services/eventService';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface DuplicateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectEvent: (event: Event) => void;
}

const DuplicateEventDialog: React.FC<DuplicateEventDialogProps> = ({
  open,
  onOpenChange,
  onSelectEvent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['duplicate-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }
      return data || [];
    },
    enabled: open,
  });

  // Filter events based on search and filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.event_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || event.event_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSelectEvent = (event: Event) => {
    onSelectEvent(event);
    onOpenChange(false);
    setSearchQuery('');
    setTypeFilter('all');
    setStatusFilter('all');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Duplicate Event
          </DialogTitle>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Live Music">Live Music</SelectItem>
                <SelectItem value="Game Night">Game Night</SelectItem>
                <SelectItem value="Specials">Specials</SelectItem>
                <SelectItem value="Soccer">Soccer</SelectItem>
                <SelectItem value="NCAA FB">NCAA FB</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-2 overflow-y-auto max-h-[400px] pr-2">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No events found</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <Card key={event.id} className="p-4 hover:border-primary transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{event.event_title}</h4>
                      <Badge variant={event.status === 'published' ? 'default' : 'secondary'} className="shrink-0">
                        {event.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(event.event_date), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                      <span className="px-2 py-0.5 bg-secondary rounded-full">
                        {event.event_type}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSelectEvent(event)}
                    className="shrink-0"
                  >
                    Select
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-end pt-2 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateEventDialog;

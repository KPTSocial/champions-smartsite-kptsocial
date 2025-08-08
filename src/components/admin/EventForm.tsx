import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Calendar, Clock, MapPin, Save, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/services/eventService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const eventFormSchema = z.object({
  event_title: z.string().min(1, 'Event title is required'),
  event_date: z.string().min(1, 'Event date is required').refine((dateStr) => {
    try {
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }, 'Please enter a valid date and time'),
  event_type: z.enum(['Live Music', 'Game Night', 'Specials']),
  description: z.string().optional(),
  location: z.enum(['on-site', 'off-site', 'virtual']).default('on-site'),
  image_url: z.string().url().optional().or(z.literal('')),
  is_featured: z.boolean().default(false),
  allow_rsvp: z.boolean().default(false),
  rsvp_link: z.string().optional(),
  recurring_pattern: z.enum(['none', 'weekly', 'monthly']).default('none'),
  status: z.enum(['draft', 'published']).default('draft')
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  event?: Event | null;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      event_title: '',
      event_date: '',
      event_type: 'Specials',
      description: '',
      location: 'on-site',
      image_url: '',
      is_featured: false,
      allow_rsvp: false,
      rsvp_link: '',
      recurring_pattern: 'none',
      status: 'draft'
    }
  });

  // Populate form if editing existing event
  useEffect(() => {
    if (event) {
      try {
        const eventDate = new Date(event.event_date);
        const formattedDate = format(eventDate, "yyyy-MM-dd'T'HH:mm");
        
        form.reset({
          event_title: event.event_title,
          event_date: formattedDate,
          event_type: event.event_type as 'Live Music' | 'Game Night' | 'Specials',
          description: event.description || '',
          location: (event.location || 'on-site') as 'on-site' | 'off-site' | 'virtual',
          image_url: event.image_url || '',
          is_featured: event.is_featured,
          allow_rsvp: event.allow_rsvp,
          rsvp_link: event.rsvp_link || '',
          recurring_pattern: (event.recurring_pattern || 'none') as 'none' | 'weekly' | 'monthly',
          status: (event.status || 'published') as 'draft' | 'published'
        });
      } catch (error) {
        console.error('Error formatting event date:', error);
        toast({
          title: "Date formatting error",
          description: "There was an issue loading the event date. Please check the time field.",
          variant: "destructive",
        });
      }
    }
  }, [event, form, toast]);

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    
    try {
      // Validate and format the date
      let eventDate: string;
      try {
        const date = new Date(data.event_date);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }
        eventDate = date.toISOString();
      } catch (dateError) {
        toast({
          title: "Invalid date",
          description: "Please enter a valid date and time.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const eventData = {
        event_title: data.event_title,
        event_date: eventDate,
        event_type: data.event_type,
        description: data.description || null,
        location: data.location,
        image_url: data.image_url || null,
        is_featured: data.is_featured,
        allow_rsvp: data.allow_rsvp,
        rsvp_link: data.allow_rsvp ? (data.rsvp_link || null) : null,
        recurring_pattern: data.recurring_pattern === 'none' ? null : data.recurring_pattern,
        status: data.status
      };

      if (event) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id);

        if (error) throw error;

        toast({
          title: "Event updated",
          description: "The event has been successfully updated.",
        });
      } else {
        // Create new event
        const { error } = await supabase
          .from('events')
          .insert(eventData);

        if (error) throw error;

        toast({
          title: "Event created",
          description: data.status === 'published' 
            ? "The event has been created and published to the live calendar."
            : "The event has been saved as a draft.",
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to save the event. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes('date')) {
          errorMessage = "There was an issue with the event date. Please check the date and time format.";
        } else if (error.message.includes('validation')) {
          errorMessage = "Please check all required fields and try again.";
        } else if (error.message.includes('network')) {
          errorMessage = "Network error. Please check your connection and try again.";
        }
      }
      
      toast({
        title: "Error saving event",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchRecurringPattern = form.watch('recurring_pattern');
  const watchAllowRsvp = form.watch('allow_rsvp');
  const watchEventTitle = form.watch('event_title');

  // Show auto-generated event preview for Taco Tuesday
  const showTriviaPreview = watchEventTitle.toLowerCase().includes('taco tuesday') && 
                           watchRecurringPattern === 'weekly';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="event_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Live Music">Live Music</SelectItem>
                        <SelectItem value="Game Night">Game Night</SelectItem>
                        <SelectItem value="Specials">Specials</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter event description..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Location & Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location & Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="on-site">On-site</SelectItem>
                        <SelectItem value="off-site">Off-site</SelectItem>
                        <SelectItem value="virtual">Virtual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recurring_pattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurring Pattern</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Repeat</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Featured Event</FormLabel>
                      <FormDescription>
                        Display prominently on the homepage
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allow_rsvp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Allow RSVP</FormLabel>
                      <FormDescription>
                        Enable RSVP functionality
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {watchAllowRsvp && (
              <FormField
                control={form.control}
                name="rsvp_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RSVP Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/rsvp"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Auto-generated Event Preview */}
        {showTriviaPreview && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Clock className="h-4 w-4" />
                Auto-Generated Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700">
                🎉 A "Trivia Night" event will be automatically created alongside this Taco Tuesday event!
              </p>
              <p className="text-sm text-blue-600 mt-2">
                The trivia event will have the same date, location, and status as this event.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Publication Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Publication Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft - Save but don't publish</SelectItem>
                      <SelectItem value="published">Published - Live on public calendar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {field.value === 'draft' 
                      ? 'Event will be saved as a draft and won\'t appear on the public calendar'
                      : 'Event will be immediately visible on the public calendar'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting 
              ? 'Saving...' 
              : event 
                ? 'Update Event' 
                : 'Create Event'
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
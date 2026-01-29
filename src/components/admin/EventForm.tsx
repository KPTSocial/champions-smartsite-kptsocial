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
import { Calendar, Clock, MapPin, Save, Eye, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Event, createDuplicateEvent } from '@/services/eventService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const eventFormSchema = z.object({
  event_title: z.string().min(1, 'Event title is required'),
  event_date: z.string().optional(),
  event_type: z.enum(['Live Music', 'Game Night', 'Specials', 'Soccer', 'NCAA FB', 'NBA', 'MLS', 'NWSL', 'Olympics', 'World Cup']),
  description: z.string().optional(),
  location: z.enum(['on-site', 'off-site', 'virtual']).default('on-site'),
  image_url: z.string().url().optional().or(z.literal('')),
  is_featured: z.boolean().default(false),
  show_as_homepage_banner: z.boolean().default(false),
  allow_rsvp: z.boolean().default(false),
  rsvp_link: z.string().optional(),
  recurring_pattern: z.enum(['none', 'weekly', 'monthly']).default('none'),
  status: z.enum(['draft', 'published']).default('draft'),
  sponsored_by: z.string().optional(),
  theme: z.string().optional()
}).superRefine((data, ctx) => {
  // If status is published, event_date is required and must be valid
  if (data.status === 'published') {
    if (!data.event_date || data.event_date.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Published events require a valid date. Save as draft if date is not set.',
        path: ['event_date'],
      });
      return;
    }
    const date = new Date(data.event_date);
    if (isNaN(date.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter a valid date and time',
        path: ['event_date'],
      });
    }
  } else if (data.event_date && data.event_date.trim() !== '') {
    // For drafts, if date is provided, it must be valid
    const date = new Date(data.event_date);
    if (isNaN(date.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter a valid date and time',
        path: ['event_date'],
      });
    }
  }
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  event?: Event | null;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Duplication state
  const [enableDuplication, setEnableDuplication] = useState(false);
  const [duplicateOption, setDuplicateOption] = useState<'draft' | 'future-date'>('draft');
  const [duplicateDate, setDuplicateDate] = useState<Date | undefined>();
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false);

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
      show_as_homepage_banner: false,
      allow_rsvp: false,
      rsvp_link: '',
      recurring_pattern: 'none',
      status: 'draft',
      sponsored_by: '',
      theme: ''
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
          event_type: event.event_type as 'Live Music' | 'Game Night' | 'Specials' | 'Soccer' | 'NCAA FB' | 'NBA' | 'MLS' | 'NWSL' | 'Olympics' | 'World Cup',
          description: event.description || '',
          location: (event.location || 'on-site') as 'on-site' | 'off-site' | 'virtual',
          image_url: event.image_url || '',
          is_featured: event.is_featured,
          show_as_homepage_banner: (event as any).show_as_homepage_banner || false,
          allow_rsvp: event.allow_rsvp,
          rsvp_link: event.rsvp_link || '',
          recurring_pattern: (event.recurring_pattern || 'none') as 'none' | 'weekly' | 'monthly',
          status: (event.status || 'published') as 'draft' | 'published',
          sponsored_by: (event as any).sponsored_by || '',
          theme: (event as any).theme || ''
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
      // Validate duplication settings
      if (enableDuplication && duplicateOption === 'future-date' && !duplicateDate) {
        toast({
          title: "Date required",
          description: "Please select a date for the duplicate event or choose 'Save as Draft'.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate and format the date
      let eventDate: string | null = null;
      if (data.event_date && data.event_date.trim() !== '') {
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
      }

      const eventData = {
        event_title: data.event_title,
        event_date: eventDate,
        event_type: data.event_type,
        description: data.description || null,
        location: data.location,
        image_url: data.image_url || null,
        is_featured: data.is_featured,
        show_as_homepage_banner: data.show_as_homepage_banner,
        allow_rsvp: data.allow_rsvp,
        rsvp_link: data.allow_rsvp ? (data.rsvp_link || null) : null,
        recurring_pattern: data.recurring_pattern === 'none' ? null : data.recurring_pattern,
        status: data.status,
        sponsored_by: data.sponsored_by || null,
        theme: data.theme || null
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
        const { data: createdEvent, error } = await supabase
          .from('events')
          .insert(eventData)
          .select()
          .single();

        if (error) throw error;

        // Handle duplication if enabled
        if (enableDuplication && createdEvent) {
          if (duplicateOption === 'draft') {
            // Create duplicate as draft with no date
            const { error: dupError } = await createDuplicateEvent(createdEvent, {
              clearDate: true,
              status: 'draft'
            });
            
            if (dupError) {
              console.error('Error creating duplicate:', dupError);
              toast({
                title: "Event created",
                description: "Event created but duplication failed. Please duplicate manually.",
                variant: "default",
              });
            } else {
              toast({
                title: "Event created and duplicated",
                description: "Event created successfully and duplicated as draft.",
              });
            }
          } else if (duplicateOption === 'future-date' && duplicateDate) {
            // Create duplicate with selected future date
            const { error: dupError } = await createDuplicateEvent(createdEvent, {
              newDate: duplicateDate.toISOString(),
              status: 'draft'
            });
            
            if (dupError) {
              console.error('Error creating duplicate:', dupError);
              toast({
                title: "Event created",
                description: "Event created but duplication failed. Please duplicate manually.",
                variant: "default",
              });
            } else {
              toast({
                title: "Event created and duplicated",
                description: `Event created and duplicated for ${format(duplicateDate, 'PPP')}.`,
              });
            }
          }
        } else {
          toast({
            title: "Event created",
            description: data.status === 'published' 
              ? "The event has been created and published to the live calendar."
              : "The event has been saved as a draft.",
          });
        }
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

  const handleDuplicateCurrentEvent = async () => {
    if (!event) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await createDuplicateEvent(event, {
        clearDate: true,
        status: 'draft'
      });

      if (error) throw error;

      toast({
        title: "Event duplicated",
        description: "Event duplicated as draft. Set a date before publishing.",
      });

      onClose();
    } catch (error) {
      console.error('Error duplicating event:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate the event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setShowDuplicateConfirm(false);
    }
  };

  const watchRecurringPattern = form.watch('recurring_pattern');
  const watchAllowRsvp = form.watch('allow_rsvp');
  const watchEventTitle = form.watch('event_title');

  // Show auto-generated event preview for Taco Tuesday
  const showTriviaPreview = watchEventTitle.toLowerCase().includes('taco tuesday') && 
                           watchRecurringPattern === 'weekly';

  // Mobile version with accordion
  if (isMobile) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Accordion type="single" collapsible defaultValue="basic" className="space-y-3">
            {/* Basic Information */}
            <AccordionItem value="basic" className="border rounded-lg">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2 font-medium">
                  <Calendar className="h-4 w-4" />
                  Basic Information
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
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

                <FormField
                  control={form.control}
                  name="event_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date & Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
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
                          <SelectItem value="Soccer">Soccer</SelectItem>
                          <SelectItem value="NCAA FB">NCAA FB</SelectItem>
                          <SelectItem value="NBA">NBA</SelectItem>
                          <SelectItem value="MLS">MLS</SelectItem>
                          <SelectItem value="NWSL">NWSL</SelectItem>
                          <SelectItem value="Olympics">Olympics</SelectItem>
                          <SelectItem value="World Cup">World Cup</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Location & Settings */}
            <AccordionItem value="location" className="border rounded-lg">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2 font-medium">
                  <MapPin className="h-4 w-4" />
                  Location & Settings
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
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

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Featured Event</FormLabel>
                        <FormDescription>Display prominently on homepage</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="show_as_homepage_banner"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Homepage Alert Banner</FormLabel>
                        <FormDescription>Display as an alert banner below the homepage hero</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                        <FormDescription>Enable RSVP functionality</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {watchAllowRsvp && (
                  <FormField
                    control={form.control}
                    name="rsvp_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RSVP Link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/rsvp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Sponsorship & Theme */}
            <AccordionItem value="sponsorship" className="border rounded-lg">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2 font-medium">
                  🍺 Sponsorship & Theme
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <FormField
                  control={form.control}
                  name="sponsored_by"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sponsored By</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Stickmen Brewing" {...field} />
                      </FormControl>
                      <FormDescription>
                        Brewery, winery, or vendor sponsoring this event (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theme</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Valentine's Day Special" {...field} />
                      </FormControl>
                      <FormDescription>
                        Special theme for this event (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Publication Status */}
            <AccordionItem value="status" className="border rounded-lg">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2 font-medium">
                  <Eye className="h-4 w-4" />
                  Publication Status
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
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
                          ? 'Event will be saved as a draft'
                          : 'Event will be visible on public calendar'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Auto-generated Event Preview */}
          {showTriviaPreview && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm text-blue-800">
                  <Clock className="h-4 w-4" />
                  Auto-Generated Event
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-blue-700">
                  🎉 A "Trivia Night" event will be auto-created!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Duplication Section - Create Mode Only */}
          {!event && (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="enable-duplication"
                    checked={enableDuplication}
                    onCheckedChange={(checked) => setEnableDuplication(checked as boolean)}
                  />
                  <Label htmlFor="enable-duplication" className="text-sm font-medium cursor-pointer">
                    Duplicate this Event
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-muted-foreground cursor-help">ⓘ</span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Creates a copy of this event for reuse. Date must be entered before publishing.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {enableDuplication && (
                  <RadioGroup value={duplicateOption} onValueChange={(val) => setDuplicateOption(val as 'draft' | 'future-date')} className="space-y-3 pl-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="draft" id="draft-option" />
                      <Label htmlFor="draft-option" className="text-sm cursor-pointer">
                        Save as Draft
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-muted-foreground cursor-help text-xs">ⓘ</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Duplicate will be saved as a draft without a date</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="future-date" id="future-date-option" />
                      <Label htmlFor="future-date-option" className="text-sm cursor-pointer">
                        Choose Future Date
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-muted-foreground cursor-help text-xs">ⓘ</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Duplicate will be created with the selected date</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {duplicateOption === 'future-date' && (
                      <div className="pl-6 pt-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !duplicateDate && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {duplicateDate ? format(duplicateDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={duplicateDate}
                              onSelect={setDuplicateDate}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            {event && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowDuplicateConfirm(true)}
                      disabled={isSubmitting}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Duplicate
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create a copy of this event as a new draft</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : (event ? 'Update' : 'Create')}
            </Button>
          </div>

          {/* Duplicate Confirmation Dialog */}
          <AlertDialog open={showDuplicateConfirm} onOpenChange={setShowDuplicateConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Duplicate Event?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will create a copy of this event as a new draft.
                  <br /><br />
                  The date will be blank and must be set before publishing.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDuplicateCurrentEvent}>
                  Duplicate Event
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
    );
  }

  // Desktop version (original)
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
                        <SelectItem value="Soccer">Soccer</SelectItem>
                        <SelectItem value="NCAA FB">NCAA FB</SelectItem>
                        <SelectItem value="NBA">NBA</SelectItem>
                        <SelectItem value="MLS">MLS</SelectItem>
                        <SelectItem value="NWSL">NWSL</SelectItem>
                        <SelectItem value="Olympics">Olympics</SelectItem>
                        <SelectItem value="World Cup">World Cup</SelectItem>
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
                name="show_as_homepage_banner"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Homepage Alert Banner</FormLabel>
                      <FormDescription>
                        Display as an alert banner below the homepage hero
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Sponsorship & Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🍺 Sponsorship & Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sponsored_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sponsored By</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Stickmen Brewing" {...field} />
                    </FormControl>
                    <FormDescription>
                      Brewery, winery, or vendor sponsoring this event
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Valentine's Day Special" {...field} />
                    </FormControl>
                    <FormDescription>
                      Special theme for this event
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

        {/* Duplication Section - Create Mode Only */}
        {!event && (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="enable-duplication-desktop"
                  checked={enableDuplication}
                  onCheckedChange={(checked) => setEnableDuplication(checked as boolean)}
                />
                <Label htmlFor="enable-duplication-desktop" className="text-sm font-medium cursor-pointer">
                  Duplicate this Event
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-muted-foreground cursor-help">ⓘ</span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Creates a copy of this event for reuse. Date must be entered before publishing.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {enableDuplication && (
                <RadioGroup value={duplicateOption} onValueChange={(val) => setDuplicateOption(val as 'draft' | 'future-date')} className="space-y-3 pl-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="draft" id="draft-option-desktop" />
                    <Label htmlFor="draft-option-desktop" className="text-sm cursor-pointer">
                      Save as Draft
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-muted-foreground cursor-help text-xs">ⓘ</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Duplicate will be saved as a draft without a date</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="future-date" id="future-date-option-desktop" />
                    <Label htmlFor="future-date-option-desktop" className="text-sm cursor-pointer">
                      Choose Future Date
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-muted-foreground cursor-help text-xs">ⓘ</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Duplicate will be created with the selected date</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {duplicateOption === 'future-date' && (
                    <div className="pl-6 pt-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !duplicateDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {duplicateDate ? format(duplicateDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={duplicateDate}
                            onSelect={setDuplicateDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </RadioGroup>
              )}
            </CardContent>
          </Card>
        )}

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
          {event && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowDuplicateConfirm(true)}
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Duplicate This Event
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create a copy of this event as a new draft</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
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

        {/* Duplicate Confirmation Dialog */}
        <AlertDialog open={showDuplicateConfirm} onOpenChange={setShowDuplicateConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Duplicate Event?</AlertDialogTitle>
              <AlertDialogDescription>
                This will create a copy of this event as a new draft.
                <br /><br />
                The date will be blank and must be set before publishing.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDuplicateCurrentEvent}>
                Duplicate Event
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
};

export default EventForm;
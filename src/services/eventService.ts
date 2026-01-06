import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Event = Tables<'events'>;

import eventsData from '@/data/events.json';

export const getEvents = async (): Promise<Event[]> => {
  // Return static data for Phase 1 demo
  return eventsData as unknown as Event[];
};

export const prepareEventForDuplication = (sourceEvent: Event) => {
  const { id, created_at, event_date, ...eventData } = sourceEvent;
  return {
    ...eventData,
    status: 'draft' as const,
    parent_event_id: sourceEvent.id,
  };
};

export const createDuplicateEvent = async (
  sourceEvent: Event,
  options: {
    clearDate?: boolean;
    newDate?: string;
    status?: 'draft' | 'published';
  }
): Promise<{ data: Event | null; error: any }> => {
  const duplicateData = prepareEventForDuplication(sourceEvent);

  const eventData = {
    ...duplicateData,
    event_date: options.clearDate ? null : (options.newDate || sourceEvent.event_date),
    status: options.status || 'draft',
  };

  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single();

  return { data, error };
};

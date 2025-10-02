import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Event = Tables<'events'>;

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase.from('events').select('*');

  if (error) {
    console.error("Error fetching events from database:", error.message);
    // Return an empty array to prevent the page from crashing if the table is missing.
    return [];
  }

  return data || [];
};

/**
 * Prepares an event for duplication by removing unique identifiers
 * and resetting the date field
 */
export const prepareEventForDuplication = (event: Event) => {
  const { id, created_at, event_date, ...eventData } = event;
  
  return {
    ...eventData,
    event_date: '', // Clear the date - user must set a new one
    status: 'draft', // Always create duplicates as drafts for safety
    parent_event_id: id, // Track the original event (optional)
  };
};

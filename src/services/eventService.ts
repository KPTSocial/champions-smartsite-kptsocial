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

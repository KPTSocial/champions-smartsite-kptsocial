
import { supabase } from "@/integrations/supabase/client";

// This interface is based on the plan. We can adjust if your DB schema differs.
export interface Event {
  id: number;
  created_at: string;
  title: string;
  date: string; // 'YYYY-MM-DD'
  recurring: 'weekly' | null;
  day_of_week: number | null; // Sunday = 0, Saturday = 6
}

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase.from('events').select('*');

  if (error) {
    console.error("Error fetching events from database:", error.message);
    // Return an empty array to prevent the page from crashing if the table is missing.
    return [];
  }

  return data || [];
};

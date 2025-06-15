
import { supabase } from "@/integrations/supabase/client";
import { TEvent } from "@/types/events";
import { startOfMonth, endOfMonth, formatISO } from "date-fns";

export const getEvents = async (): Promise<TEvent[]> => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const getEventsByMonth = async (date: Date): Promise<TEvent[]> => {
  const startDate = formatISO(startOfMonth(date));
  const endDate = formatISO(endOfMonth(date));

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", startDate)
    .lte("event_date", endDate)
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error fetching events by month:", error);
    throw new Error(error.message);
  }

  return data || [];
};

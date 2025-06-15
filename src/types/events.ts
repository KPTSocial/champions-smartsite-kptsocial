
import type { Database } from "@/integrations/supabase/types";

export type TEvent = Database["public"]["Tables"]["events"]["Row"];

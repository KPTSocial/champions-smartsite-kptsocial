import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HomepageContentItem {
  id: string;
  section_name: string;
  title: string;
  description: string;
  image_url: string | null;
  alt_text: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const useHomepageContent = () => {
  return useQuery({
    queryKey: ["homepage-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_content")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) {
        throw new Error(`Failed to fetch homepage content: ${error.message}`);
      }

      return data as HomepageContentItem[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
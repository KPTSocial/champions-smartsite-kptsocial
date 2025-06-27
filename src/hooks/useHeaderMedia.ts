
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useHeaderMedia = () => {
  return useQuery({
    queryKey: ['header-media'],
    queryFn: async () => {
      console.log('Fetching header media data...');
      
      const { data, error } = await supabase
        .from('header_media')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching header media:', error);
        throw error;
      }

      console.log('Header media data fetched:', data);
      return data;
    },
  });
};


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
        .single();

      if (error) {
        console.error('Error fetching header media:', error);
        // Return a default video object if no data is found
        return {
          id: 'default',
          title: 'Champions Header Video',
          video_url: 'https://res.cloudinary.com/de3djsvlk/video/upload/v1751055359/Header_Video_Champions_q0d1vs.mp4',
          description: 'Main homepage video header for Champions website',
          is_active: true,
          created_at: new Date().toISOString()
        };
      }

      console.log('Header media data fetched:', data);
      return data;
    },
  });
};

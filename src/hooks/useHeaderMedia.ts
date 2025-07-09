
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useHeaderMedia = () => {
  return useQuery({
    queryKey: ['header-media', Date.now()], // Cache busting for debugging
    queryFn: async () => {
      console.log('=== FETCHING HEADER MEDIA DATA ===');
      
      try {
        const { data, error, count } = await supabase
          .from('header_media')
          .select('*', { count: 'exact' })
          .eq('is_active', true)
          .maybeSingle();

        console.log('Supabase query result:', { data, error, count });
        console.log('Raw query response data:', JSON.stringify(data, null, 2));

        if (error) {
          console.error('Supabase error details:', error);
          throw error;
        }

        if (!data) {
          console.log('❌ No active header media found in database');
          console.log('❌ Query returned null - checking if any records exist...');
          
          // Check if any records exist at all
          const { data: allRecords, error: allError } = await supabase
            .from('header_media')
            .select('*');
          
          console.log('All header_media records:', allRecords);
          console.log('All records error:', allError);
          
          throw new Error('No active header media found in database');
        }

        console.log('✅ Header media data successfully fetched:', data);
        console.log('✅ Video URL:', data.video_url);
        return data;
      } catch (err) {
        console.error('❌ Error in header media query:', err);
        throw err;
      }
    },
    refetchOnWindowFocus: true, // Enable for debugging
    retry: 1, // Reduce retries for faster debugging
    retryDelay: 500,
    staleTime: 0, // Always refetch for debugging
    gcTime: 0, // Don't cache for debugging
  });
};

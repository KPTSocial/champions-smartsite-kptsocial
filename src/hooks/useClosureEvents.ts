import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BannerEvent {
  id: string;
  event_title: string;
  event_date: string;
  description: string | null;
  show_as_homepage_banner: boolean;
}

export const useClosureEvents = () => {
  return useQuery({
    queryKey: ['homepage-banner-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, event_title, event_date, description, show_as_homepage_banner')
        .eq('show_as_homepage_banner', true)
        .eq('status', 'published')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Error fetching banner events:', error);
        return [];
      }

      return (data || []) as BannerEvent[];
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchOnMount: true,
  });
};

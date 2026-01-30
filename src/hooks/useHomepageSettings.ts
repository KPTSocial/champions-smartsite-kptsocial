import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HomepageSettings {
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_text: string;
}

const DEFAULT_SETTINGS: HomepageSettings = {
  hero_title: "Hillsboro's Sports Bar & Flavor Hub",
  hero_subtitle: "Experience the thrill of the game and the taste of locally-sourced, PNW cuisine. Welcome to your new favorite spot.",
  about_title: "A Bar for Champions",
  about_text: "We're more than just a sports bar. We're a family friendly, community hub with a passion for fresh ingredients and unforgettable moments.",
};

export const useHomepageSettings = () => {
  return useQuery({
    queryKey: ['homepage-settings'],
    queryFn: async (): Promise<HomepageSettings> => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('hero_title, hero_subtitle, about_title, about_text')
        .eq('id', 1)
        .single();

      if (error) {
        console.error('Error fetching homepage settings:', error);
        return DEFAULT_SETTINGS;
      }

      return {
        hero_title: (data as any)?.hero_title || DEFAULT_SETTINGS.hero_title,
        hero_subtitle: (data as any)?.hero_subtitle || DEFAULT_SETTINGS.hero_subtitle,
        about_title: (data as any)?.about_title || DEFAULT_SETTINGS.about_title,
        about_text: (data as any)?.about_text || DEFAULT_SETTINGS.about_text,
      };
    },
    staleTime: 1000 * 60 * 1, // 1 minute - shorter for faster updates
    refetchOnWindowFocus: true, // Refetch when user tabs back to homepage
  });
};

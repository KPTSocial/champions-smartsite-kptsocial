import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HeroBadge {
  id: string;
  image_url: string;
  is_active: boolean;
  has_end_date: boolean;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export const useHeroBadge = () => {
  return useQuery({
    queryKey: ['hero-badge'],
    queryFn: async (): Promise<HeroBadge | null> => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('hero_badges')
        .select('*')
        .eq('is_active', true)
        .or(`has_end_date.eq.false,end_date.gte.${today}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as HeroBadge | null;
    },
  });
};

export const useHeroBadgeAdmin = () => {
  return useQuery({
    queryKey: ['hero-badge-admin'],
    queryFn: async (): Promise<HeroBadge | null> => {
      const { data, error } = await supabase
        .from('hero_badges')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as HeroBadge | null;
    },
  });
};

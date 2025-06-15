
import { supabase } from '@/integrations/supabase/client';
import { MenuSection } from '@/types/menu';

/**
 * Fetches all menu sections, their associated categories, and their associated menu items.
 * This function assumes a 'menu_items' table with a foreign key to 'menu_categories',
 * and 'menu_categories' with a foreign key to 'menu_sections'.
 * The relationships must be configured in Supabase for the nested query to work.
 */
export async function getMenuData(): Promise<MenuSection[]> {
  const { data, error } = await supabase
    .from('menu_sections')
    .select(`
      id,
      name,
      description,
      categories:menu_categories (
        id,
        name,
        description,
        items:menu_items (
          id,
          name,
          description,
          price,
          image_url
        )
      )
    `)
    .order('sort_order', { ascending: true })
    .order('sort_order', { foreignTable: 'menu_categories', ascending: true });


  if (error) {
    console.error('Error fetching menu data:', error);
    // Re-throw the error to be caught by React Query's error handling
    throw error;
  }

  // Supabase might return null if the table is empty or RLS fails.
  return data || [];
}

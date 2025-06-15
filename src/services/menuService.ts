
import { supabase } from '@/lib/supabase';
import { MenuCategory } from '@/types/menu';

/**
 * Fetches all menu categories and their associated menu items.
 * This function assumes a 'menu_items' table with a foreign key relationship
 * to the 'menu_categories' table.
 * The relationship must be configured in Supabase for the nested query to work.
 */
export async function getMenuData(): Promise<MenuCategory[]> {
  const { data, error } = await supabase
    .from('menu_categories')
    .select(`
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
    `)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching menu data:', error);
    // Re-throw the error to be caught by React Query's error handling
    throw error;
  }

  // With the alias, data should already have the 'items' property.
  // Supabase might return null if the table is empty or RLS fails.
  return data || [];
}

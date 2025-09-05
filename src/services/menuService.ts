
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
      categories:menu_categories!inner (
        id,
        name,
        description,
        is_visible,
        items:menu_items (
          id,
          name,
          description,
          price,
          image_url,
          is_available,
          tags,
          variants:menu_item_variants (
            id,
            name,
            price
          )
        )
      )
    `)
    .eq('menu_categories.is_visible', true)
    .order('sort_order', { ascending: true })
    .order('sort_order', { foreignTable: 'menu_categories', ascending: true })
    .order('sort_order', { foreignTable: 'menu_items', ascending: true });


  if (error) {
    console.error('Error fetching menu data:', error);
    // Re-throw the error to be caught by React Query's error handling
    throw error;
  }

  // Filter out items that are not available (hidden from public view)
  // Keep the structure intact, just filter the items within each category
  const filteredData = data?.map(section => ({
    ...section,
    categories: section.categories?.map(category => ({
      ...category,
      items: category.items?.filter(item => item.is_available !== false) || []
    })) || []
  })) || [];

  return filteredData;
}

import { MenuSection } from '@/types/menu';
import menuData from '@/data/menu.json';

/**
 * Fetches menu data from local JSON file for Phase 1 Static Build.
 */
export async function getMenuData(): Promise<MenuSection[]> {
  // Simulate network delay for realism if desired, or return immediately
  // await new Promise(resolve => setTimeout(resolve, 300));

  // Cast the JSON data to the compatible type. 
  // In a real scenario, we might want runtime validation (zod), but for this demo, direct casting is fine.
  return menuData as unknown as MenuSection[];
}


export interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: number;
}

export interface MenuCategory {
  id: number;
  name: string;
  description: string | null;
  items: MenuItem[];
}


export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  items: MenuItem[];
}

export interface MenuSection {
  id: string;
  name: string;
  description: string | null;
  categories: MenuCategory[];
}

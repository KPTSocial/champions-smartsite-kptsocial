
export interface MenuItemVariant {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  tags?: string[];
  variants?: MenuItemVariant[];
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

import React from 'react';
import { MenuCategory } from '@/types/menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MenuItemDisplay from './MenuItemDisplay';
interface MenuCategoryCardProps {
  category: MenuCategory;
  showDisclaimer?: boolean;
  sectionName?: string;
}
const MenuCategoryCard: React.FC<MenuCategoryCardProps> = ({
  category,
  showDisclaimer = false,
  sectionName
}) => {
  if (!category.items || category.items.length === 0) {
    return null;
  }
  return <Card className="h-full overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-serif text-secondary">
          {category.name}
          {category.name === 'Happy Hour' && (
            <span className="text-base font-normal text-muted-foreground ml-2">(Dine-In Only)</span>
          )}
        </CardTitle>
        {category.description}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="divide-y divide-border/30">
          {category.items.map(item => <MenuItemDisplay key={item.id} item={item} />)}
        </div>
      </CardContent>
    </Card>;
};
export default MenuCategoryCard;
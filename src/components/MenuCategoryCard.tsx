import React from 'react';
import { MenuCategory } from '@/types/menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
import MenuItemAccordion from './MenuItemAccordion';

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

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-serif text-secondary">{category.name}</CardTitle>
        {category.description && (
          <p className="text-muted-foreground text-sm leading-relaxed">{category.description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="single" collapsible className="space-y-3">
          {category.items.map((item) => (
            <MenuItemAccordion key={item.id} item={item} />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default MenuCategoryCard;
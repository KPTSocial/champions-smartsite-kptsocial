import React from 'react';
import { MenuCategory } from '@/types/menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
import MenuItemAccordion from './MenuItemAccordion';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  if (!category.items || category.items.length === 0) {
    return null;
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className={isMobile ? "pb-3" : "pb-4"}>
        <CardTitle className={`font-serif text-secondary ${isMobile ? "text-xl" : "text-2xl"}`}>
          {category.name}
        </CardTitle>
        {category.description && (
          <p className={`text-muted-foreground leading-relaxed ${isMobile ? "text-xs" : "text-sm"}`}>
            {category.description}
          </p>
        )}
      </CardHeader>
      <CardContent className={isMobile ? "pt-0 px-3" : "pt-0"}>
        <Accordion type="single" collapsible className={isMobile ? "space-y-2" : "space-y-3"}>
          {category.items.map((item) => (
            <MenuItemAccordion key={item.id} item={item} />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default MenuCategoryCard;
import React from 'react';
import { MenuCategory } from '@/types/menu';
import { Accordion } from '@/components/ui/accordion';
import MenuItemAccordion from './MenuItemAccordion';
import MenuSectionDisclaimer from './MenuSectionDisclaimer';

interface EnhancedMenuCategorySectionProps {
  category: MenuCategory;
}

const EnhancedMenuCategorySection: React.FC<EnhancedMenuCategorySectionProps> = ({ category }) => {
  if (!category.items || category.items.length === 0) {
    return null;
  }

  return (
    <section id={category.name.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-28">
      <h3 className="text-3xl font-serif font-bold mb-2 text-secondary">{category.name}</h3>
      {category.description && (
        <p className="text-muted-foreground mb-8 max-w-2xl">{category.description}</p>
      )}
      <Accordion type="single" collapsible className="space-y-4">
        {category.items.map((item) => (
          <MenuItemAccordion key={item.id} item={item} />
        ))}
      </Accordion>
      <MenuSectionDisclaimer />
    </section>
  );
};

export default EnhancedMenuCategorySection;
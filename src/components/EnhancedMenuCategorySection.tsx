import React from 'react';
import { MenuCategory } from '@/types/menu';
import { Accordion } from '@/components/ui/accordion';
import MenuItemAccordion from './MenuItemAccordion';
import FoodSectionDisclaimer from './FoodSectionDisclaimer';
import DrinksSectionDisclaimer from './DrinksSectionDisclaimer';

interface EnhancedMenuCategorySectionProps {
  category: MenuCategory;
  showDisclaimer?: boolean;
  sectionName?: string;
}

const EnhancedMenuCategorySection: React.FC<EnhancedMenuCategorySectionProps> = ({ category, showDisclaimer = false, sectionName }) => {
  if (!category.items || category.items.length === 0) {
    return null;
  }

  return (
    <section id={category.name.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-28">
      <h3 className="text-3xl font-serif font-bold mb-2 text-secondary">{category.name}</h3>
      <Accordion type="single" collapsible className="space-y-4">
        {category.items.map((item) => (
          <MenuItemAccordion key={item.id} item={item} />
        ))}
      </Accordion>
      {showDisclaimer && (
        sectionName?.toLowerCase().includes('drink') || sectionName?.toLowerCase().includes('beverage') || sectionName?.toLowerCase().includes('bar') ? 
          <DrinksSectionDisclaimer categoryDescription={category.description} /> : 
          <FoodSectionDisclaimer categoryDescription={category.description} />
      )}
    </section>
  );
};

export default EnhancedMenuCategorySection;
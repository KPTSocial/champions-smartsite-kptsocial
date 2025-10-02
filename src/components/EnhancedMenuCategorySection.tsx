import React from 'react';
import { MenuCategory } from '@/types/menu';
import MenuItemDisplay from './MenuItemDisplay';
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
      <h3 className="text-3xl font-serif font-bold mb-4 text-secondary">{category.name}</h3>
      {category.description && (
        <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">{category.description}</p>
      )}
      <div className="bg-background/70 backdrop-blur-sm rounded-lg border border-border/50 p-6">
        <div className="divide-y divide-border/30">
          {category.items.map((item) => (
            <MenuItemDisplay key={item.id} item={item} />
          ))}
        </div>
      </div>
      {showDisclaimer && (
        sectionName?.toLowerCase().includes('drink') || sectionName?.toLowerCase().includes('beverage') || sectionName?.toLowerCase().includes('bar') ? 
          <DrinksSectionDisclaimer categoryDescription={category.description} /> : 
          <FoodSectionDisclaimer categoryDescription={category.description} />
      )}
    </section>
  );
};

export default EnhancedMenuCategorySection;
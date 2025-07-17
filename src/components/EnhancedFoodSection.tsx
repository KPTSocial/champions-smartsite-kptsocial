import React from 'react';
import { MenuSection } from '@/types/menu';
import FoodCategoryDropdown from './FoodCategoryDropdown';
import EnhancedMenuCategorySection from './EnhancedMenuCategorySection';

interface EnhancedFoodSectionProps {
  section: MenuSection;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const EnhancedFoodSection: React.FC<EnhancedFoodSectionProps> = ({ 
  section, 
  selectedCategory, 
  onCategorySelect 
}) => {
  // Filter categories based on selection
  const displayCategories = selectedCategory 
    ? section.categories.filter(cat => cat.id === selectedCategory)
    : section.categories;

  return (
    <section id={section.name.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-20">
      <h2 className="text-4xl font-serif font-bold mb-4 text-center text-secondary">{section.name}</h2>
      {section.description && (
        <p className="text-muted-foreground mb-12 max-w-3xl mx-auto text-center">{section.description}</p>
      )}
      
      <FoodCategoryDropdown
        categories={section.categories}
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
      />

      <div className="space-y-16">
        {displayCategories.length > 0 ? (
          displayCategories.map((category, index) => (
            <EnhancedMenuCategorySection 
              key={category.id} 
              category={category} 
              showDisclaimer={index === displayCategories.length - 1}
              sectionName={section.name}
            />
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-2xl text-muted-foreground">No items available in this category.</p>
            <p className="text-muted-foreground mt-2">Please select a different category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EnhancedFoodSection;
import React from 'react';
import { MenuSection } from '@/types/menu';
import FoodCategoryDropdown from './FoodCategoryDropdown';
import MenuCategoryCard from './MenuCategoryCard';
import FoodSectionDisclaimer from './FoodSectionDisclaimer';
import DrinksSectionDisclaimer from './DrinksSectionDisclaimer';
import SundayBreakfastDisclaimer from './SundayBreakfastDisclaimer';

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

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {displayCategories.length > 0 ? (
          displayCategories.map((category) => (
            <MenuCategoryCard 
              key={category.id} 
              category={category} 
              sectionName={section.name}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-2xl text-muted-foreground">No items available in this category.</p>
            <p className="text-muted-foreground mt-2">Please select a different category.</p>
          </div>
        )}
      </div>
      
      {/* Show disclaimer after the cards */}
      {displayCategories.length > 0 && (
        section.name === 'Sunday Breakfast' ? (
          <SundayBreakfastDisclaimer />
        ) : section.name?.toLowerCase().includes('drink') || section.name?.toLowerCase().includes('beverage') || section.name?.toLowerCase().includes('bar') ? (
          <DrinksSectionDisclaimer categoryDescription={section.description} />
        ) : (
          <FoodSectionDisclaimer categoryDescription={section.description} />
        )
      )}
    </section>
  );
};

export default EnhancedFoodSection;
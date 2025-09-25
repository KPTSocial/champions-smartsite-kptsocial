
import React from 'react';
import { MenuSection, MenuCategory } from '@/types/menu';

interface DesktopMenuNavigationProps {
  menuData: MenuSection[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string) => void;
}

const DesktopMenuNavigation = ({
  menuData,
  selectedCategory,
  onCategoryChange,
}: DesktopMenuNavigationProps) => {
  // Categorize sections into Food and Beverage
  const foodSections = menuData.filter(section => 
    section.name.toLowerCase().includes('food') || 
    section.name.toLowerCase().includes('appetizer') || 
    section.name.toLowerCase().includes('entree') || 
    section.name.toLowerCase().includes('main') ||
    section.name.toLowerCase().includes('dessert') ||
    section.name.toLowerCase().includes('salad') ||
    section.name.toLowerCase().includes('soup')
  );
  
  const beverageSections = menuData.filter(section => 
    section.name.toLowerCase().includes('drink') || 
    section.name.toLowerCase().includes('beverage') || 
    section.name.toLowerCase().includes('cocktail') || 
    section.name.toLowerCase().includes('beer') || 
    section.name.toLowerCase().includes('wine') ||
    section.name.toLowerCase().includes('coffee') ||
    section.name.toLowerCase().includes('tea')
  );

  const foodCategories = foodSections.flatMap(section => section.categories);
  const beverageCategories = beverageSections.flatMap(section => section.categories);

  const CategoryButton = ({ category }: { category: MenuCategory }) => (
    <button
      key={category.id}
      onClick={() => onCategoryChange(category.id)}
      aria-label={`Select ${category.name} category`}
      aria-pressed={selectedCategory === category.id}
      className={`px-4 py-2 rounded-full border transition-colors text-sm font-medium ${
        selectedCategory === category.id
          ? 'bg-primary text-primary-foreground'
          : 'bg-card hover:bg-primary hover:text-primary-foreground'
      }`}
    >
      {category.name}
    </button>
  );

  return (
    <div className="sticky top-[81px] bg-background/80 z-40 py-6 mb-8 backdrop-blur-sm -mx-6 px-6 border-b">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Food Menu Column */}
          {foodCategories.length > 0 && (
            <div>
              <h3 className="text-xl font-serif font-bold mb-4 text-primary">Food Menu</h3>
              <div className="flex flex-wrap gap-2">
                {foodCategories.map(category => (
                  <CategoryButton key={category.id} category={category} />
                ))}
              </div>
            </div>
          )}

          {/* Drink Menu Column */}
          {beverageCategories.length > 0 && (
            <div>
              <h3 className="text-xl font-serif font-bold mb-4 text-primary">Drink Menu</h3>
              <div className="flex flex-wrap gap-2">
                {beverageCategories.map(category => (
                  <CategoryButton key={category.id} category={category} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopMenuNavigation;

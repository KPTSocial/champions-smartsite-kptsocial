
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MenuSection, MenuCategory } from '@/types/menu';

interface MobileMenuNavigationProps {
  menuData: MenuSection[];
  selectedMenuType: string | null;
  selectedCategory: string | null;
  onMenuTypeChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const MobileMenuNavigation = ({
  menuData,
  selectedMenuType,
  selectedCategory,
  onMenuTypeChange,
  onCategoryChange,
}: MobileMenuNavigationProps) => {
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

  // Get categories for the selected menu type
  const getAvailableCategories = (): MenuCategory[] => {
    if (!selectedMenuType) return [];
    
    const sections = selectedMenuType === 'food' ? foodSections : beverageSections;
    return sections.flatMap(section => section.categories);
  };

  const availableCategories = getAvailableCategories();

  return (
    <div className="space-y-4 mb-8">
      <Select value={selectedMenuType || ''} onValueChange={onMenuTypeChange}>
        <SelectTrigger className="text-lg p-6">
          <SelectValue placeholder="Select Menu Type" />
        </SelectTrigger>
        <SelectContent>
          {foodSections.length > 0 && (
            <SelectItem value="food">Food Menu</SelectItem>
          )}
          {beverageSections.length > 0 && (
            <SelectItem value="beverage">Drink Menu</SelectItem>
          )}
        </SelectContent>
      </Select>

      {selectedMenuType && availableCategories.length > 0 && (
        <Select value={selectedCategory || ''} onValueChange={onCategoryChange}>
          <SelectTrigger className="text-lg p-6">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {availableCategories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default MobileMenuNavigation;

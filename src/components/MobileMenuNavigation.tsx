
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
    <div className="space-y-3 mb-6 px-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Menu Type</label>
        <Select value={selectedMenuType || ''} onValueChange={onMenuTypeChange}>
          <SelectTrigger className="h-12 text-base font-medium bg-card border-2 hover:border-primary/20 transition-colors">
            <SelectValue placeholder="Choose Menu Type" />
          </SelectTrigger>
          <SelectContent className="bg-card border-2">
            {foodSections.length > 0 && (
              <SelectItem value="food" className="h-12 text-base">
                🍽️ Food Menu
              </SelectItem>
            )}
            {beverageSections.length > 0 && (
              <SelectItem value="beverage" className="h-12 text-base">
                🍺 Drink Menu
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedMenuType && availableCategories.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Category</label>
          <Select value={selectedCategory || ''} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-12 text-base font-medium bg-card border-2 hover:border-primary/20 transition-colors">
              <SelectValue placeholder="Choose Category" />
            </SelectTrigger>
            <SelectContent className="bg-card border-2">
              {availableCategories.map(category => (
                <SelectItem key={category.id} value={category.id} className="h-12 text-base">
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default MobileMenuNavigation;

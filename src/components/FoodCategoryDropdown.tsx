import React, { useState } from 'react';
import { MenuCategory } from '@/types/menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface FoodCategoryDropdownProps {
  categories: MenuCategory[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const FoodCategoryDropdown: React.FC<FoodCategoryDropdownProps> = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}) => {
  const [resetKey, setResetKey] = useState(0);

  if (!categories || categories.length === 0) {
    return null;
  }

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  const handleCategorySelect = (categoryId: string | null) => {
    onCategorySelect(categoryId);
    setResetKey(prev => prev + 1); // Force accordion to reset/close
  };

  return (
    <div className="mb-8">
      <Accordion 
        key={resetKey}
        type="single" 
        collapsible 
        className="w-full"
      >
        <AccordionItem value="food-categories" className="bg-background/70 backdrop-blur-sm rounded-lg border border-border/50">
          <AccordionTrigger className="px-3 sm:px-4 md:px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold">
                {selectedCategoryData ? selectedCategoryData.name : 'Select Food Category'}
              </span>
              {selectedCategoryData && (
                <Badge variant="secondary" className="text-xs">
                  {selectedCategoryData.items.length} items
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 sm:px-4 md:px-6 pb-4">
            <div className="space-y-4">
              <button
                onClick={() => handleCategorySelect(null)}
                aria-label="View all food categories"
                aria-pressed={!selectedCategory}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  !selectedCategory 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'bg-background/50 hover:bg-background/80 border border-border/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">All Food Categories</span>
                  <Badge variant="outline" className="text-xs">
                    {categories.reduce((total, cat) => total + cat.items.length, 0)} items
                  </Badge>
                </div>
              </button>
              
              {/* All categories in a single responsive grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    aria-label={`Select ${category.name} category with ${category.items.length} items`}
                    aria-pressed={selectedCategory === category.id}
                    className={`p-2 sm:p-3 rounded-lg transition-colors text-center ${
                      selectedCategory === category.id 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'bg-background/50 hover:bg-background/80 border border-border/30'
                    }`}
                  >
                    <div className="font-medium text-xs sm:text-sm">{category.name}</div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {category.items.length} items
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FoodCategoryDropdown;
import React from 'react';
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
  if (!categories || categories.length === 0) {
    return null;
  }

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="mb-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="food-categories" className="bg-background/70 backdrop-blur-sm rounded-lg border border-border/50">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
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
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-4">
              <button
                onClick={() => onCategorySelect(null)}
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
              
              {/* 4-row grid layout */}
              <div className="space-y-3">
                {/* Row 1: First 3 categories */}
                <div className="grid grid-cols-3 gap-3">
                  {categories.slice(0, 3).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => onCategorySelect(category.id)}
                      className={`p-3 rounded-lg transition-colors text-center ${
                        selectedCategory === category.id 
                          ? 'bg-primary/20 text-primary border border-primary/30' 
                          : 'bg-background/50 hover:bg-background/80 border border-border/30'
                      }`}
                    >
                      <div className="font-medium text-sm">{category.name}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {category.items.length} items
                      </Badge>
                    </button>
                  ))}
                </div>
                
                {/* Row 2: Categories 4-6 */}
                <div className="grid grid-cols-3 gap-3">
                  {categories.slice(3, 6).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => onCategorySelect(category.id)}
                      className={`p-3 rounded-lg transition-colors text-center ${
                        selectedCategory === category.id 
                          ? 'bg-primary/20 text-primary border border-primary/30' 
                          : 'bg-background/50 hover:bg-background/80 border border-border/30'
                      }`}
                    >
                      <div className="font-medium text-sm">{category.name}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {category.items.length} items
                      </Badge>
                    </button>
                  ))}
                </div>
                
                {/* Row 3: Categories 7-9 */}
                <div className="grid grid-cols-3 gap-3">
                  {categories.slice(6, 9).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => onCategorySelect(category.id)}
                      className={`p-3 rounded-lg transition-colors text-center ${
                        selectedCategory === category.id 
                          ? 'bg-primary/20 text-primary border border-primary/30' 
                          : 'bg-background/50 hover:bg-background/80 border border-border/30'
                      }`}
                    >
                      <div className="font-medium text-sm">{category.name}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {category.items.length} items
                      </Badge>
                    </button>
                  ))}
                </div>
                
                {/* Row 4: Remaining categories (2 columns, centered) */}
                {categories.slice(9).length > 0 && (
                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                    {categories.slice(9).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => onCategorySelect(category.id)}
                        className={`p-3 rounded-lg transition-colors text-center ${
                          selectedCategory === category.id 
                            ? 'bg-primary/20 text-primary border border-primary/30' 
                            : 'bg-background/50 hover:bg-background/80 border border-border/30'
                        }`}
                      >
                        <div className="font-medium text-sm">{category.name}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {category.items.length} items
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FoodCategoryDropdown;
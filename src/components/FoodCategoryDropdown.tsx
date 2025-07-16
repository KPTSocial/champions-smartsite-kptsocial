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
            <div className="space-y-2">
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
              
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === category.id 
                      ? 'bg-primary/20 text-primary border border-primary/30' 
                      : 'bg-background/50 hover:bg-background/80 border border-border/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-muted-foreground mt-1">{category.description}</div>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {category.items.length} items
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FoodCategoryDropdown;
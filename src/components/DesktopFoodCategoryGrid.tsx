import React from 'react';
import { MenuCategory } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DesktopFoodCategoryGridProps {
  categories: MenuCategory[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const DesktopFoodCategoryGrid: React.FC<DesktopFoodCategoryGridProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  const getCategoryButton = (category: MenuCategory) => (
    <Button
      key={category.id}
      variant={selectedCategory === category.id ? "default" : "outline"}
      onClick={() => onCategorySelect(category.id)}
      className="h-auto p-4 flex flex-col items-center gap-2 min-h-[80px] hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <span className="font-semibold text-sm text-center leading-tight">{category.name}</span>
      <Badge variant="secondary" className="text-xs">
        {category.items.length} {category.items.length === 1 ? 'item' : 'items'}
      </Badge>
    </Button>
  );

  // Get categories by name for fixed positioning
  const getCategoryByName = (name: string) => 
    categories.find(cat => cat.name.toLowerCase().includes(name.toLowerCase()));

  return (
    <div className="mb-8 space-y-4">
      {/* Row 1: Shareables, Salads & Wraps, Soups */}
      <div className="grid grid-cols-3 gap-4">
        {getCategoryByName('shareable') && getCategoryButton(getCategoryByName('shareable')!)}
        {getCategoryByName('salad') && getCategoryButton(getCategoryByName('salad')!)}
        {getCategoryByName('soup') && getCategoryButton(getCategoryByName('soup')!)}
      </div>

      {/* Row 2: Sliders, Latin Inspired, Flatbread Pizzas */}
      <div className="grid grid-cols-3 gap-4">
        {getCategoryByName('slider') && getCategoryButton(getCategoryByName('slider')!)}
        {getCategoryByName('latin') && getCategoryButton(getCategoryByName('latin')!)}
        {getCategoryByName('flatbread') && getCategoryButton(getCategoryByName('flatbread')!)}
      </div>

      {/* Row 3: *Charbroiled Burgers, Sandos, Full Plates */}
      <div className="grid grid-cols-3 gap-4">
        {getCategoryByName('charbroiled') && getCategoryButton(getCategoryByName('charbroiled')!)}
        {getCategoryByName('sando') && getCategoryButton(getCategoryByName('sando')!)}
        {getCategoryByName('full plate') && getCategoryButton(getCategoryByName('full plate')!)}
      </div>

      {/* Row 4: Dessert, Daily Brunch (2 columns centered) */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {getCategoryByName('dessert') && getCategoryButton(getCategoryByName('dessert')!)}
        {getCategoryByName('brunch') && getCategoryButton(getCategoryByName('brunch')!)}
      </div>
    </div>
  );
};

export default DesktopFoodCategoryGrid;
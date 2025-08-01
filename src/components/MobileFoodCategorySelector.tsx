import React from 'react';
import { MenuCategory } from '@/types/menu';
import { Badge } from '@/components/ui/badge';

interface MobileFoodCategorySelectorProps {
  categories: MenuCategory[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const MobileFoodCategorySelector: React.FC<MobileFoodCategorySelectorProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <label className="text-sm font-medium text-muted-foreground mb-3 block">Food Category</label>
      <div className="space-y-3">
        <button
          onClick={() => onCategorySelect(null)}
          className={`w-full text-left p-4 rounded-lg transition-colors ${
            !selectedCategory 
              ? 'bg-primary/20 text-primary border-2 border-primary/30' 
              : 'bg-card hover:bg-muted border-2 border-border/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-base">All Food Categories</span>
            <Badge variant="outline" className="text-sm">
              {categories.reduce((total, cat) => total + cat.items.length, 0)} items
            </Badge>
          </div>
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`w-full text-left p-4 rounded-lg transition-colors ${
              selectedCategory === category.id 
                ? 'bg-primary/20 text-primary border-2 border-primary/30' 
                : 'bg-card hover:bg-muted border-2 border-border/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-base">{category.name}</span>
              <Badge variant="outline" className="text-sm">
                {category.items.length} items
              </Badge>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileFoodCategorySelector;
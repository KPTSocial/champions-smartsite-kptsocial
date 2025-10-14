import React from 'react';
import { MenuCategory } from '@/types/menu';
import ModernMenuItem from './ModernMenuItem';

interface ModernMenuCategoryProps {
  category: MenuCategory;
  sectionName?: string;
}

const ModernMenuCategory: React.FC<ModernMenuCategoryProps> = ({ category, sectionName }) => {
  if (!category.items || category.items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-3xl font-serif font-bold text-secondary mb-2">
          {category.name}
          {category.name === 'Happy Hour' && (
            <span className="text-base font-normal text-muted-foreground ml-2">(Dine-In Only)</span>
          )}
        </h3>
        {category.description && (
          <p className="text-muted-foreground leading-relaxed">{category.description}</p>
        )}
      </div>
      
      <div className="bg-background/70 backdrop-blur-sm rounded-lg border border-border/50 p-6">
        <div className="divide-y divide-border/30">
          {category.items.map((item) => (
            <ModernMenuItem key={item.id} item={item} sectionName={sectionName} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernMenuCategory;

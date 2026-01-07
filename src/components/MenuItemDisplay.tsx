import React from 'react';
import { MenuItem } from '@/types/menu';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface MenuItemDisplayProps {
  item: MenuItem;
}

const MenuItemDisplay: React.FC<MenuItemDisplayProps> = ({ item }) => {
  return (
    <div className="py-4 border-b border-border/30 last:border-0 group hover:bg-primary/5 transition-all duration-200 cursor-pointer rounded-lg px-3 -mx-3">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Tags + Name */}
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {item.tags?.includes('CF') && (
            <img src="/icons/champions-favorite.png" alt="Champion's Favorite" className="w-5 h-5 flex-shrink-0" />
          )}
          {item.tags?.includes('GF') && (
            <img src="https://res.cloudinary.com/de3djsvlk/image/upload/v1754249140/gf_tmnou5.jpg" alt="Gluten Friendly" className="w-5 h-5 flex-shrink-0" />
          )}
          {item.tags?.includes('V') && (
            <img src="https://res.cloudinary.com/de3djsvlk/image/upload/v1754249140/veg_fbwf0q.jpg" alt="Vegetarian" className="w-5 h-5 flex-shrink-0" />
          )}
          <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">{item.name}</h4>
          {item.tags?.includes('NEW') && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 animate-new-pulse font-bold shadow-lg">
              <Sparkles className="h-3 w-3 mr-1" />
              NEW
            </Badge>
          )}
        </div>
        
        {/* Right: Price */}
        {!item.variants || item.variants.length === 0 ? (
          <span className="text-base text-muted-foreground whitespace-nowrap">
            {formatCurrency(item.price)}
          </span>
        ) : null}
      </div>
      
      {/* Description */}
      {item.description && (
        <p className="text-base text-muted-foreground mt-2 leading-relaxed">
          {item.description}
        </p>
      )}
      
      {/* Variants */}
      {item.variants && item.variants.length > 0 && (
        <div className="mt-3 space-y-1">
          {item.variants.map((variant) => (
            <div key={variant.id} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{variant.name}</span>
              <span className="text-base text-muted-foreground">{formatCurrency(variant.price)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItemDisplay;

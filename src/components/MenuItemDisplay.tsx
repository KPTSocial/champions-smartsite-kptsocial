import React from 'react';
import { MenuItem } from '@/types/menu';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Sparkles, Crown, Wheat, Leaf } from 'lucide-react';

interface MenuItemDisplayProps {
  item: MenuItem;
}

const MenuItemDisplay: React.FC<MenuItemDisplayProps> = ({ item }) => {
  return (
    <div className="py-4 border-b border-border/30 last:border-0 group hover:bg-primary/5 transition-all duration-200 cursor-pointer rounded-lg px-3 -mx-3 text-center">
      <div className="flex flex-col items-center">
        {/* Tags + Name - Centered */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {item.tags?.includes('CF') && (
            <Crown className="w-5 h-5 text-amber-500 flex-shrink-0" />
          )}
          {item.tags?.includes('GF') && (
            <Wheat className="w-5 h-5 text-amber-600 flex-shrink-0" />
          )}
          {item.tags?.includes('V') && (
            <Leaf className="w-5 h-5 text-green-600 flex-shrink-0" />
          )}
          <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 text-center">{item.name}</h4>
          {item.tags?.includes('NEW') && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 animate-new-pulse font-bold shadow-lg">
              <Sparkles className="h-3 w-3 mr-1" />
              NEW
            </Badge>
          )}
        </div>
        
        {/* Price - Centered */}
        {!item.variants || item.variants.length === 0 ? (
          <span className="text-base text-muted-foreground whitespace-nowrap mt-1">
            {formatCurrency(item.price)}
          </span>
        ) : null}
      </div>
      
      {/* Description */}
      {item.description && (
        <p className="text-base text-muted-foreground mt-2 leading-relaxed text-center">
          {item.description}
        </p>
      )}
      
      {/* Variants */}
      {item.variants && item.variants.length > 0 && (
        <div className="mt-3 space-y-1 w-full">
          {item.variants.map((variant) => (
            <div key={variant.id} className="flex justify-center items-center gap-3">
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

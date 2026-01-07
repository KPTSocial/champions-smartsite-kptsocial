import React from 'react';
import { MenuItem } from '@/types/menu';
import { Badge } from '@/components/ui/badge';

interface ModernMenuItemProps {
  item: MenuItem;
  sectionName?: string;
}

const ModernMenuItem: React.FC<ModernMenuItemProps> = ({ item, sectionName }) => {
  const isBreakfast = sectionName?.toLowerCase().includes('breakfast');
  const isDrink = sectionName?.toLowerCase().includes('drink') || 
                  sectionName?.toLowerCase().includes('beverage') ||
                  sectionName?.toLowerCase().includes('bar');

  const formatPrice = (price: number | null | undefined) => {
    if (price == null) return '0';
    return price.toFixed(2).replace(/\.?0+$/, '');
  };

  return (
    <div className="group py-4 border-b border-border/50 last:border-0 hover:bg-accent/5 transition-colors px-4 sm:px-6 rounded-lg">
      <div className="flex flex-col space-y-2">
        {/* Item Name and Tags */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {item.name}
            </h4>
            
            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs font-medium px-2 py-0.5"
                  >
                    {tag === 'CF' && '🫘 CF'}
                    {tag === 'GF' && '🌾 GF'}
                    {tag === 'V' && '🌱 V'}
                    {tag === 'NEW' && '✨ NEW'}
                    {tag !== 'CF' && tag !== 'GF' && tag !== 'V' && tag !== 'NEW' && tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description and Price */}
        <div className="flex flex-col space-y-2">
          {/* Description with price inline */}
          {item.description ? (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
              {/* Only show price after description if no variants */}
              {(!item.variants || item.variants.length === 0) && (
              <span className="ml-2 text-muted-foreground">
                ${formatPrice(item.price)}
              </span>
              )}
            </p>
          ) : (
            /* No description - show price standalone */
            (!item.variants || item.variants.length === 0) ? (
              <span className="text-sm text-muted-foreground">
                ${formatPrice(item.price)}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                ${formatPrice(Math.min(...item.variants.map(v => v.price)))}
              </span>
            )
          )}

          {/* Variants - show all options */}
          {item.variants && item.variants.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {item.variants.map(variant => (
                <div 
                  key={variant.id} 
                  className="flex items-center gap-2 text-sm bg-secondary/20 rounded-md px-3 py-1.5"
                >
                  <span className="font-medium text-foreground">{variant.name}</span>
                  <span className="text-muted-foreground">${formatPrice(variant.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernMenuItem;

import React from 'react';
import { MenuItem } from '@/types/menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Sparkles, Crown, Wheat, Leaf } from 'lucide-react';

interface MenuItemAccordionProps {
  item: MenuItem;
}

const MenuItemAccordion: React.FC<MenuItemAccordionProps> = ({ item }) => {
  return (
    <AccordionItem value={item.id} className="bg-background/70 backdrop-blur-sm rounded-lg border border-border/50 overflow-hidden">
      <AccordionTrigger className="px-6 py-4 hover:no-underline">
        <span className="font-semibold text-left flex items-center gap-2 flex-wrap">
          {item.tags?.includes('CF') && (
            <Crown className="w-6 h-6 text-amber-500" />
          )}
          {item.tags?.includes('GF') && (
            <Wheat className="w-6 h-6 text-amber-600" />
          )}
          {item.tags?.includes('V') && (
            <Leaf className="w-6 h-6 text-green-600" />
          )}
          <span className="flex-1">{item.name}</span>
          {item.tags?.includes('NEW') && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 animate-new-pulse font-bold shadow-lg ml-auto">
              <Sparkles className="h-3 w-3 mr-1" />
              NEW
            </Badge>
          )}
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-4">
        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
        {item.variants && item.variants.length > 0 ? (
          <div className="mt-2">
            {item.variants.map((variant) => (
              <p key={variant.id} className="text-muted-foreground leading-relaxed">
                {variant.name} {formatCurrency(variant.price)}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground leading-relaxed mt-2">{formatCurrency(item.price)}</p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default MenuItemAccordion;
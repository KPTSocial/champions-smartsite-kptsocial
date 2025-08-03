import React from 'react';
import { MenuItem } from '@/types/menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formatCurrency } from '@/lib/utils';

interface MenuItemAccordionProps {
  item: MenuItem;
}

const MenuItemAccordion: React.FC<MenuItemAccordionProps> = ({ item }) => {
  return (
    <AccordionItem value={item.id} className="bg-background/70 backdrop-blur-sm rounded-lg border border-border/50 overflow-hidden">
      <AccordionTrigger className="px-6 py-4 hover:no-underline">
        <span className="font-semibold text-left flex items-center gap-2">
          {item.tags?.includes('CF') && (
            <img src="https://res.cloudinary.com/de3djsvlk/image/upload/v1754249140/fav_jvg2qc.jpg" alt="Champ's Favorite" className="w-5 h-5" />
          )}
          {item.name}
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
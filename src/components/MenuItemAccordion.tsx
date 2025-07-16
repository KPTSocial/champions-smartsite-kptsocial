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
        <div className="flex justify-between items-center w-full">
          <span className="font-semibold text-left">{item.name}</span>
          <span className="font-bold text-lg text-primary ml-4">{formatCurrency(item.price)}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-4">
        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
      </AccordionContent>
    </AccordionItem>
  );
};

export default MenuItemAccordion;
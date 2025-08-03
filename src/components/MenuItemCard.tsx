
import { MenuItem } from '@/types/menu';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

const MenuItemCard = ({ item }: { item: MenuItem }) => {
  return (
    <Card className="flex flex-col overflow-hidden h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {item.tags?.includes('CF') && (
            <img src="/lovable-uploads/09615d0b-1415-472e-b4e0-3b034815d7a0.png" alt="Champ's Favorite" className="w-4 h-4" />
          )}
          {item.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{item.description}</CardDescription>
        <p className="text-sm text-muted-foreground mt-2">{formatCurrency(item.price)}</p>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;

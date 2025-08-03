
import { MenuItem } from '@/types/menu';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

const MenuItemCard = ({ item }: { item: MenuItem }) => {
  return (
    <Card className="flex flex-col overflow-hidden h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {item.tags?.includes('CF') && (
            <img src="https://res.cloudinary.com/de3djsvlk/image/upload/v1754249140/fav_jvg2qc.jpg" alt="Champ's Favorite" className="w-4 h-4" />
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

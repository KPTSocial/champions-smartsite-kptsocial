
import { MenuItem } from '@/types/menu';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

const MenuItemCard = ({ item }: { item: MenuItem }) => {
  return (
    <Card className="flex flex-col overflow-hidden h-full">
      {item.image_url ? (
         <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">No Image</span>
        </div>
      )}
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{item.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <p className="font-semibold text-lg text-primary">{formatCurrency(item.price)}</p>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;

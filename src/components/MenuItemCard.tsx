
import { MenuItem } from '@/types/menu';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

const MenuItemCard = ({ item }: { item: MenuItem }) => {
  return (
    <Card className="flex flex-col overflow-hidden h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 flex-wrap">
          {item.tags?.includes('CF') && (
            <img src="/icons/champions-favorite.png" alt="Champion's Favorite" className="w-6 h-6" />
          )}
          {item.tags?.includes('GF') && (
            <img src="https://res.cloudinary.com/de3djsvlk/image/upload/v1754249140/gf_tmnou5.jpg" alt="Gluten Friendly" className="w-6 h-6" />
          )}
          {item.tags?.includes('V') && (
            <img src="https://res.cloudinary.com/de3djsvlk/image/upload/v1754249140/veg_fbwf0q.jpg" alt="Vegetarian" className="w-6 h-6" />
          )}
          <span className="flex-1">{item.name}</span>
          {item.tags?.includes('NEW') && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 animate-new-pulse font-bold shadow-lg">
              <Sparkles className="h-3 w-3 mr-1" />
              NEW
            </Badge>
          )}
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

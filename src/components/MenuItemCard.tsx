
import { MenuItem } from '@/types/menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Sparkles, Crown, Wheat, Leaf } from 'lucide-react';

const MenuItemCard = ({ item }: { item: MenuItem }) => {
  return (
    <Card className="flex flex-col overflow-hidden h-full text-center">
      <CardHeader className="items-center">
        <CardTitle className="flex items-center justify-center gap-2 flex-wrap">
          {item.tags?.includes('CF') && (
            <Crown className="w-6 h-6 text-amber-500" />
          )}
          {item.tags?.includes('GF') && (
            <Wheat className="w-6 h-6 text-amber-600" />
          )}
          {item.tags?.includes('V') && (
            <Leaf className="w-6 h-6 text-green-600" />
          )}
          <span>{item.name}</span>
          {item.tags?.includes('NEW') && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 animate-new-pulse font-bold shadow-lg">
              <Sparkles className="h-3 w-3 mr-1" />
              NEW
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center">
        <CardDescription className="text-center">{item.description}</CardDescription>
        <p className="text-sm text-muted-foreground mt-2 text-center">{formatCurrency(item.price)}</p>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;

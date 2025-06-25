
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Package, Utensils, Tag, Star } from 'lucide-react';

const MenuStats: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['menu-stats'],
    queryFn: async () => {
      const [sectionsResult, categoriesResult, itemsResult, specialsResult] = await Promise.all([
        supabase.from('menu_sections').select('id').eq('id', 'id'),
        supabase.from('menu_categories').select('id').eq('id', 'id'),
        supabase.from('menu_items').select('id').eq('id', 'id'),
        supabase.from('menu_items').select('id').eq('is_special', true)
      ]);

      return {
        sections: sectionsResult.data?.length || 0,
        categories: categoriesResult.data?.length || 0,
        items: itemsResult.data?.length || 0,
        specials: specialsResult.data?.length || 0
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Menu Sections',
      value: stats?.sections || 0,
      description: 'Food & Beverage sections',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Categories',
      value: stats?.categories || 0,
      description: 'Item categories',
      icon: Tag,
      color: 'text-green-600'
    },
    {
      title: 'Menu Items',
      value: stats?.items || 0,
      description: 'Total menu items',
      icon: Utensils,
      color: 'text-purple-600'
    },
    {
      title: 'Current Specials',
      value: stats?.specials || 0,
      description: 'Active special items',
      icon: Star,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MenuStats;

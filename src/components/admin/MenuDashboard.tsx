
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MenuSectionManager from './MenuSectionManager';
import MenuCategoryManager from './MenuCategoryManager';
import MenuItemManager from './MenuItemManager';
import MonthlySpecialsManager from './MonthlySpecialsManager';
import MenuStats from './MenuStats';

const MenuDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
        <p className="text-gray-600 mt-2">Manage your restaurant's menu sections, categories, and items</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="monthly-specials">Monthly Specials</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <MenuStats />
        </TabsContent>

        <TabsContent value="monthly-specials">
          <MonthlySpecialsManager />
        </TabsContent>

        <TabsContent value="sections">
          <MenuSectionManager />
        </TabsContent>

        <TabsContent value="categories">
          <MenuCategoryManager />
        </TabsContent>

        <TabsContent value="items">
          <MenuItemManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuDashboard;

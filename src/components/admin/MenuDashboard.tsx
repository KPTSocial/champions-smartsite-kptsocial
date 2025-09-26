
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MenuSectionManager from './MenuSectionManager';
import MenuCategoryManager from './MenuCategoryManager';
import MenuItemManager from './MenuItemManager';
import MonthlySpecialsManager from './MonthlySpecialsManager';
import MenuStats from './MenuStats';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  LayoutGrid, 
  Calendar, 
  Layers, 
  FolderOpen, 
  ClipboardList 
} from 'lucide-react';

const MenuDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useIsMobile();

  const sections = [
    { 
      value: 'overview', 
      label: 'Overview', 
      icon: LayoutGrid,
      content: <MenuStats />
    },
    { 
      value: 'monthly-specials', 
      label: 'Monthly Specials', 
      icon: Calendar,
      content: <MonthlySpecialsManager />
    },
    { 
      value: 'sections', 
      label: 'Sections', 
      icon: Layers,
      content: <MenuSectionManager />
    },
    { 
      value: 'categories', 
      label: 'Categories', 
      icon: FolderOpen,
      content: <MenuCategoryManager />
    },
    { 
      value: 'items', 
      label: 'Menu Items', 
      icon: ClipboardList,
      content: <MenuItemManager />
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Menu Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your restaurant's menu sections, categories, and items</p>
      </div>

      {/* Desktop View - Tabs */}
      {!isMobile ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            {sections.map((section) => (
              <TabsTrigger key={section.value} value={section.value}>
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.value} value={section.value} className="space-y-6">
              {section.content}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        /* Mobile View - Accordion */
        <Accordion 
          type="single" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <AccordionItem key={section.value} value={section.value}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">{section.label}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
};

export default MenuDashboard;

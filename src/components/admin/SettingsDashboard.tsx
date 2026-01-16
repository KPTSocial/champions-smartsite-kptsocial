import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Clock } from 'lucide-react';
import HoursOfOperationManager from './HoursOfOperationManager';

const SettingsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hours');
  const isMobile = useIsMobile();

  const sections = [
    {
      value: 'hours',
      label: 'Hours of Operation',
      icon: Clock,
      content: <HoursOfOperationManager />,
    },
    // Future settings sections can be added here
    // { value: 'contact', label: 'Contact Info', icon: Phone, content: <ContactInfoManager /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Manage your restaurant's site settings and configuration
        </p>
      </div>

      {/* Desktop View - Tabs */}
      {!isMobile ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${sections.length}, 1fr)` }}>
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

export default SettingsDashboard;

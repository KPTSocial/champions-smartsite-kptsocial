import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMenuData } from '@/services/menuService';
import { MenuSection } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import EnhancedMenuTabs from '@/components/EnhancedMenuTabs';
import ModernMenuCategory from '@/components/ModernMenuCategory';
import FoodSectionDisclaimer from '@/components/FoodSectionDisclaimer';
import DrinksSectionDisclaimer from '@/components/DrinksSectionDisclaimer';
import { BackgroundContainer } from '@/components/ui/background-container';
import { PageHeader } from '@/components/ui/page-header';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { MenuDownloadLink } from '@/components/MenuDownloadLink';

const Menu = () => {
  const [activeSection, setActiveSection] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: menuData, isLoading, isError, error } = useQuery<MenuSection[], Error>({
    queryKey: ['menuData'],
    queryFn: getMenuData,
    retry: false,
  });

  // Set up real-time listeners for menu changes
  useEffect(() => {
    const channels = [
      supabase
        .channel('menu_sections_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'menu_sections' },
          () => queryClient.invalidateQueries({ queryKey: ['menuData'] })
        ),
      supabase
        .channel('menu_categories_changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'menu_categories' },
          () => queryClient.invalidateQueries({ queryKey: ['menuData'] })
        ),
      supabase
        .channel('menu_items_changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'menu_items' },
          () => queryClient.invalidateQueries({ queryKey: ['menuData'] })
        ),
      supabase
        .channel('menu_item_variants_changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'menu_item_variants' },
          () => queryClient.invalidateQueries({ queryKey: ['menuData'] })
        )
    ];

    // Subscribe to all channels
    channels.forEach(channel => channel.subscribe());

    // Cleanup function
    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [queryClient]);

  const filteredMenuData = useMemo(() => {
    if (!menuData) return [];
    return menuData;
  }, [menuData]);

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  // Set initial active section when data loads
  useMemo(() => {
    if (menuData && menuData.length > 0 && !activeSection) {
      setActiveSection(menuData[0].id);
    }
  }, [menuData, activeSection]);

  if (isLoading) {
    return (
      <div className="container py-16 md:py-24 text-center">
        <h1 className="text-5xl font-bold text-center mb-4">Our Menu</h1>
        <p className="text-center text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Loading our delicious menu...
        </p>
        <div className="space-y-16">
          <div className="w-1/3 h-8 bg-muted rounded mx-auto animate-pulse"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="h-80 bg-muted rounded animate-pulse"></div>
            <div className="h-80 bg-muted rounded animate-pulse"></div>
            <div className="h-80 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    const isAuthError = error?.message.includes("JWT") || error?.message.includes("permission") || error?.message.includes("api-key");
    return (
      <div className="container py-16 md:py-24 text-center">
        <h1 className="text-5xl font-bold text-center mb-4 text-destructive">
          {isAuthError ? 'Access Denied' : 'Oops! Something went wrong.'}
        </h1>
        <p className="text-center text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          We couldn't load the menu right now. Please try again later.
        </p>
        {isAuthError && (
          <div className="bg-destructive/10 border border-destructive/50 text-destructive p-4 rounded-lg max-w-3xl mx-auto text-left">
            <h3 className="font-bold">Developer Notice: Supabase Configuration Error</h3>
            <p className="mt-2">Could not fetch data from Supabase. This is likely a configuration issue. Please check the following:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>The Supabase integration is correctly configured in Lovable with your project's <strong>API URL</strong> and <strong>Anon Key</strong>.</li>
              <li>Row Level Security (RLS) is enabled on your <code>menu_sections</code>, <code>menu_categories</code> and <code>menu_items</code> tables, and a policy exists that allows <strong>read access (`SELECT`)</strong> for non-authenticated users. I just added these for you, but it's good to double-check.</li>
              <li>The table and column names in <code>src/services/menuService.ts</code> match your Supabase schema exactly.</li>
              <li>The foreign key relationships between sections, categories, and items are correctly configured in Supabase.</li>
            </ul>
          </div>
        )}
        <pre className="mt-4 p-4 bg-secondary/20 rounded text-sm whitespace-pre-wrap text-left max-w-3xl mx-auto"><code>{error.message}</code></pre>
        <Button asChild className="mt-8">
            <Link to="/">Back to Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <BackgroundContainer
      backgroundImage="https://hqgdbufmokvrsydajdfr.supabase.co/storage/v1/object/public/photos/Menu/A7304939.jpg"
      className="py-16 md:py-24"
      grayscale={true}
    >
      <PageHeader
        title="Our Menu"
        description="Seasonally Inspired Ingredients. Bold Flavors. Explore our selection of hand-crafted dishes, curated in-house year-round."
      />

        {/* Enhanced Tab Navigation */}
        <div className="menu-section lg:rounded-lg p-8 mb-8 relative">
          {menuData && (
            <EnhancedMenuTabs
              sections={menuData}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          )}
        </div>
        {/* Enhanced Menu Content */}
        <div className="menu-section lg:rounded-lg p-8">
          {filteredMenuData && filteredMenuData.length > 0 ? (
            <div className="space-y-20">
              {filteredMenuData
                .filter(section => !activeSection || section.id === activeSection)
                .map(section => (
                  <section key={section.id} id={section.name.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-20">
                    {/* Section Header */}
                    <div className="text-center mb-8">
                      <h2 className="text-4xl font-serif font-bold text-secondary mb-3">
                        {section.name}
                      </h2>
                      {section.description && section.id !== 'de2ef338-ab9a-43ef-8332-c95cb0d549b9' && (
                        <p className="text-muted-foreground max-w-3xl mx-auto">
                          {section.description}
                        </p>
                      )}
                      
                      {/* Download link for Current Specials */}
                      {section.id === 'de2ef338-ab9a-43ef-8332-c95cb0d549b9' && (
                        <MenuDownloadLink 
                          fileName="january-2026-specials.png"
                          downloadName="January-2026-Specials.png"
                          displayText={`Download ${section.description || 'Monthly'} Menu`}
                          isLocalFile
                        />
                      )}
                      
                      {/* Download link for Main Menu */}
                      {section.id === 'db2f01ba-7cb1-4221-895d-a63855748272' && (
                        <MenuDownloadLink 
                          fileName="champions-menu-fall-2025.pdf"
                          downloadName="Champions-Main-Menu.pdf"
                          displayText="Download Main Menu"
                        />
                      )}
                      
                      <Separator className="mt-6 max-w-xs mx-auto" />
                    </div>

                    {/* Categories Grid */}
                    <div className="space-y-8">
                      {section.categories.map((category) => (
                        <ModernMenuCategory
                          key={category.id}
                          category={category}
                          sectionName={section.name}
                        />
                      ))}
                    </div>

                    {/* Section Disclaimer */}
                    {section.categories.length > 0 && (
                      <div className="mt-8">
                        {section.name?.toLowerCase().includes('drink') || 
                         section.name?.toLowerCase().includes('beverage') || 
                         section.name?.toLowerCase().includes('bar') ? (
                          <DrinksSectionDisclaimer categoryDescription={section.description} />
                        ) : (
                          <FoodSectionDisclaimer categoryDescription={section.description} />
                        )}
                      </div>
                    )}
                  </section>
                ))}
              {/* Show global disclaimer when viewing all sections */}
              {!activeSection && filteredMenuData.length > 1 && (
                <div className="mt-16">
                  <FoodSectionDisclaimer />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-2xl text-muted-foreground">Please select a menu type and category to view items.</p>
            </div>
          )}
        </div>
    </BackgroundContainer>
  );
};

export default Menu;

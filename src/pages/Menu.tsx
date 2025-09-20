import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMenuData } from '@/services/menuService';
import { Input } from '@/components/ui/input';
import { MenuSection, MenuCategory } from '@/types/menu';
import MenuCategorySection from '@/components/MenuCategorySection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileMenuNavigation from '@/components/MobileMenuNavigation';
import DesktopMenuNavigation from '@/components/DesktopMenuNavigation';
import EnhancedMenuTabs from '@/components/EnhancedMenuTabs';
import EnhancedFoodSection from '@/components/EnhancedFoodSection';
import MenuCategoryCard from '@/components/MenuCategoryCard';
import FoodSectionDisclaimer from '@/components/FoodSectionDisclaimer';
import DrinksSectionDisclaimer from '@/components/DrinksSectionDisclaimer';
import menuBackground from '@/assets/menu-background.jpg';
import { createBackgroundStyle } from '@/lib/background-utils';
import { supabase } from '@/integrations/supabase/client';

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMenuType, setSelectedMenuType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const isMobile = useIsMobile();
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

    let filtered = menuData;

    // Filter by menu type on mobile
    if (isMobile && selectedMenuType) {
      const isFood = selectedMenuType === 'food';
      filtered = menuData.filter(section => {
        const sectionName = section.name.toLowerCase();
        if (isFood) {
          return sectionName.includes('food') || 
                 sectionName.includes('appetizer') || 
                 sectionName.includes('entree') || 
                 sectionName.includes('main') ||
                 sectionName.includes('dessert') ||
                 sectionName.includes('salad') ||
                 sectionName.includes('soup') ||
                 sectionName.includes('breakfast');
        } else {
          return sectionName.includes('drink') || 
                 sectionName.includes('beverage') || 
                 sectionName.includes('cocktail') || 
                 sectionName.includes('beer') || 
                 sectionName.includes('wine') ||
                 sectionName.includes('coffee') ||
                 sectionName.includes('tea');
        }
      });
    }

    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered
        .map(section => ({
          ...section,
          categories: section.categories.filter(category => category.id === selectedCategory)
        }))
        .filter(section => section.categories.length > 0);
    }

    // Apply search filter
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filtered = filtered
        .map(section => {
          if (section.name.toLowerCase().includes(lowercasedFilter)) {
            return section;
          }

          const filteredCategories = section.categories
            .map(category => {
              if (category.name.toLowerCase().includes(lowercasedFilter)) {
                return category;
              }

              const filteredItems = category.items.filter(
                item =>
                  item.name.toLowerCase().includes(lowercasedFilter) ||
                  item.description?.toLowerCase().includes(lowercasedFilter)
              );

              if (filteredItems.length > 0) {
                return { ...category, items: filteredItems };
              }
              return null;
            })
            .filter((category): category is MenuCategory => category !== null);

          if (filteredCategories.length > 0) {
            return { ...section, categories: filteredCategories };
          }
          return null;
        })
        .filter((section): section is MenuSection => section !== null);
    }

    return filtered;
  }, [menuData, searchTerm, selectedMenuType, selectedCategory, isMobile]);

  const handleMenuTypeChange = (value: string) => {
    setSelectedMenuType(value);
    setSelectedCategory(null); // Reset category when menu type changes
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setSelectedCategory(null);
    setSelectedFoodCategory(null); // Reset food category when switching sections
  };

  const handleFoodCategoryChange = (categoryId: string | null) => {
    setSelectedFoodCategory(categoryId);
  };

  // Helper function to check if a section is a food section
  const isFoodSection = (section: MenuSection) => {
    const sectionName = section.name.toLowerCase();
    return sectionName.includes('food') || 
           sectionName.includes('appetizer') || 
           sectionName.includes('entree') || 
           sectionName.includes('main') ||
           sectionName.includes('dessert') ||
           sectionName.includes('salad') ||
           sectionName.includes('soup') ||
           sectionName.includes('breakfast');
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
    <div 
      className="min-h-screen"
      style={{
        ...createBackgroundStyle(menuBackground),
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container py-16 md:py-24">
        <div className="menu-section rounded-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Our Menu</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Seasonally Inspired Ingredients. Bold Flavors. Explore our selection of hand-crafted dishes, curated in-house year-round.
            </p>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="menu-section rounded-lg p-8 mb-8">
          {menuData && (
            <EnhancedMenuTabs
              sections={menuData}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          )}
          
          <div className="mb-8 max-w-lg mx-auto">
            <Input
              type="text"
              placeholder="Search for a dish, category, or section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-lg p-6 bg-background/80 backdrop-blur-sm"
            />
          </div>
        </div>
        {/* Enhanced Menu Content */}
        <div className="menu-section rounded-lg p-8">
          {filteredMenuData && filteredMenuData.length > 0 ? (
            <div className="space-y-20">
              {filteredMenuData
                .filter(section => !activeSection || section.id === activeSection)
                .map(section => (
                  isFoodSection(section) ? (
                    <EnhancedFoodSection
                      key={section.id}
                      section={section}
                      selectedCategory={selectedFoodCategory}
                      onCategorySelect={handleFoodCategoryChange}
                    />
                  ) : (
                    <section key={section.id} id={section.name.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-20">
                      <h2 className="text-4xl font-serif font-bold mb-4 text-center text-secondary">{section.name}</h2>
                      {section.description && <p className="text-muted-foreground mb-12 max-w-3xl mx-auto text-center">{section.description}</p>}
                      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                        {section.categories.map((category) => (
                          <MenuCategoryCard 
                            key={category.id} 
                            category={category} 
                            sectionName={section.name}
                          />
                        ))}
                      </div>
                      {/* Show disclaimer after the cards */}
                      {section.categories.length > 0 && (
                        section.name?.toLowerCase().includes('drink') || section.name?.toLowerCase().includes('beverage') || section.name?.toLowerCase().includes('bar') ? 
                          <DrinksSectionDisclaimer categoryDescription={section.description} /> : 
                          <FoodSectionDisclaimer categoryDescription={section.description} />
                      )}
                    </section>
                  )
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
              {searchTerm ? (
                <>
                  <p className="text-2xl text-muted-foreground">No dishes found for "{searchTerm}".</p>
                  <p className="text-muted-foreground mt-2">Try a different search term or clear your search.</p>
                </>
              ) : selectedCategory ? (
                <>
                  <p className="text-2xl text-muted-foreground">No items available in this category.</p>
                  <p className="text-muted-foreground mt-2">Please select a different category.</p>
                </>
              ) : (
                <>
                  <p className="text-2xl text-muted-foreground">Please select a menu type and category to view items.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;

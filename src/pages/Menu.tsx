
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMenuData } from '@/services/menuService';
import { Input } from '@/components/ui/input';
import { MenuSection, MenuCategory } from '@/types/menu';
import MenuCategorySection from '@/components/MenuCategorySection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: menuData, isLoading, isError, error } = useQuery<MenuSection[], Error>({
    queryKey: ['menuData'],
    queryFn: getMenuData,
    retry: false, // Don't retry on auth/config errors
  });

  const filteredMenuData = useMemo(() => {
    if (!menuData) return [];
    if (!searchTerm) return menuData;

    const lowercasedFilter = searchTerm.toLowerCase();

    return menuData
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
  }, [menuData, searchTerm]);
  
  const allCategories = useMemo(() => {
    if (!menuData) return []; // Use original menuData for nav to show all categories
    return menuData.flatMap(section => section.categories);
  }, [menuData]);


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
    <div className="container py-16 md:py-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Our Menu</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Farm-fresh ingredients, bold flavors. Explore our selection of hand-crafted dishes.
        </p>
      </div>

      <div className="sticky top-[81px] bg-background/80 z-40 py-4 mb-8 backdrop-blur-sm -mx-6 px-6 border-b">
        <div className="container mx-auto flex flex-wrap gap-x-4 gap-y-2 justify-center">
        {allCategories.map(category => (
            <a 
              key={category.id} 
              href={`#${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-4 py-2 rounded-full border bg-card hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>
      
      <div className="mb-12 max-w-lg mx-auto">
        <Input
          type="text"
          placeholder="Search for a dish, category, or section..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-lg p-6"
        />
      </div>

      {filteredMenuData && filteredMenuData.length > 0 ? (
        <div className="space-y-20">
          {filteredMenuData.map(section => (
            <section key={section.id} id={section.name.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-20">
              <h2 className="text-5xl font-serif font-bold mb-4 text-center text-primary">{section.name}</h2>
              {section.description && <p className="text-muted-foreground mb-12 max-w-3xl mx-auto text-center">{section.description}</p>}
              <div className="space-y-16">
                {section.categories.map(category => (
                  <MenuCategorySection key={category.id} category={category} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-2xl text-muted-foreground">No dishes found for "{searchTerm}".</p>
          <p className="text-muted-foreground mt-2">Try a different search term or clear your search.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;

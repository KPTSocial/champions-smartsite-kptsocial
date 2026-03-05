import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileUp, Package, Calendar, Utensils } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MenuImageUploadDialog from './MenuImageUploadDialog';
import PdfMenuUploadDialog from './PdfMenuUploadDialog';
import MainMenuUploadWizard from './MainMenuUploadWizard';

const MenuOverviewCards: React.FC = () => {
  const queryClient = useQueryClient();

  // Dialog states
  const [specialsImageOpen, setSpecialsImageOpen] = useState(false);
  const [specialsUploadOpen, setSpecialsUploadOpen] = useState(false);
  const [mainImageOpen, setMainImageOpen] = useState(false);
  const [mainWizardOpen, setMainWizardOpen] = useState(false);
  const [mainBulkOpen, setMainBulkOpen] = useState(false);

  // Fetch categories for PdfMenuUploadDialog
  const { data: categories } = useQuery({
    queryKey: ['menu-categories-for-overview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('id, name, section:menu_sections(name)')
        .order('section_id')
        .order('sort_order');
      if (error) throw error;
      return data as Array<{ id: string; name: string; section: { name: string } }>;
    },
  });

  // Get Monthly Specials category ID for auto-mark
  const { data: specialsCat } = useQuery({
    queryKey: ['monthly-specials-cat-id'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('id')
        .eq('name', 'Monthly Specials')
        .single();
      if (error) throw error;
      return data;
    },
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['menuData'] });
    queryClient.invalidateQueries({ queryKey: ['menu-stats'] });
    queryClient.invalidateQueries({ queryKey: ['monthly-specials-items'] });
    queryClient.invalidateQueries({ queryKey: ['site-settings'] });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Specials Card */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Calendar className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <CardTitle className="text-lg">Monthly Specials</CardTitle>
                <CardDescription>Seasonal specials menu for customers</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => setSpecialsImageOpen(true)}
            >
              <Upload className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">Upload Menu Image for Customers</div>
                <div className="text-xs text-muted-foreground">PDF or image customers can download — no parsing</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => setSpecialsUploadOpen(true)}
            >
              <FileUp className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">Upload New Menu</div>
                <div className="text-xs text-muted-foreground">Parse items, update pricing & descriptions, save for download</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Main Menu Card */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Utensils className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <CardTitle className="text-lg">Main Menu</CardTitle>
                <CardDescription>Full restaurant menu with section verification</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => setMainImageOpen(true)}
            >
              <Upload className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">Upload Menu Image for Customers</div>
                <div className="text-xs text-muted-foreground">PDF or image customers can download — no parsing</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => setMainWizardOpen(true)}
            >
              <FileUp className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">Upload New Menu</div>
                <div className="text-xs text-muted-foreground">Section-by-section verification before publishing</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => setMainBulkOpen(true)}
            >
              <Package className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">Upload Bulk Items</div>
                <div className="text-xs text-muted-foreground">Import items directly into any category</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Specials Dialogs */}
      <MenuImageUploadDialog
        open={specialsImageOpen}
        onOpenChange={setSpecialsImageOpen}
        target="monthly_specials"
        onUploadComplete={handleRefresh}
      />

      {categories && (
        <PdfMenuUploadDialog
          open={specialsUploadOpen}
          onOpenChange={setSpecialsUploadOpen}
          categories={categories}
          onImportComplete={handleRefresh}
          defaultCategoryId={specialsCat?.id}
          autoMarkAsSpecial={true}
        />
      )}

      {/* Main Menu Dialogs */}
      <MenuImageUploadDialog
        open={mainImageOpen}
        onOpenChange={setMainImageOpen}
        target="main_menu"
        onUploadComplete={handleRefresh}
      />

      <MainMenuUploadWizard
        open={mainWizardOpen}
        onOpenChange={setMainWizardOpen}
        onImportComplete={handleRefresh}
      />

      {categories && (
        <PdfMenuUploadDialog
          open={mainBulkOpen}
          onOpenChange={setMainBulkOpen}
          categories={categories}
          onImportComplete={handleRefresh}
        />
      )}
    </>
  );
};

export default MenuOverviewCards;


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  section_id: string;
  section?: {
    name: string;
  };
}

interface MenuSection {
  id: string;
  name: string;
}

const MenuCategoryManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    section_id: '',
    sort_order: 0
  });

  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['menu-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_categories')
        .select(`
          *,
          section:menu_sections(name)
        `)
        .order('section_id')
        .order('sort_order');
      
      if (error) throw error;
      return data as MenuCategory[];
    }
  });

  const { data: sections } = useQuery({
    queryKey: ['menu-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_sections')
        .select('id, name')
        .order('sort_order');
      
      if (error) throw error;
      return data as MenuSection[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newCategory: Omit<MenuCategory, 'id' | 'section'>) => {
      const { data, error } = await supabase
        .from('menu_categories')
        .insert(newCategory)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
      toast.success('Category created successfully');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Error creating category: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MenuCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('menu_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
      toast.success('Category updated successfully');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Error updating category: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
      toast.success('Category deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting category: ${error.message}`);
    }
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', section_id: '', sort_order: 0 });
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      updateMutation.mutate({ ...formData, id: editingCategory.id });
    } else {
      const categoriesInSection = categories?.filter(c => c.section_id === formData.section_id) || [];
      const maxSortOrder = Math.max(...categoriesInSection.map(c => c.sort_order), 0);
      createMutation.mutate({ ...formData, sort_order: maxSortOrder + 1 });
    }
  };

  const handleEdit = (category: MenuCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      section_id: category.section_id,
      sort_order: category.sort_order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category? This will also delete all items within it.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading categories...</div>;
  }

  // Group categories by section
  const categoriesBySection = categories?.reduce((acc, category) => {
    const sectionName = category.section?.name || 'Unknown Section';
    if (!acc[sectionName]) {
      acc[sectionName] = [];
    }
    acc[sectionName].push(category);
    return acc;
  }, {} as Record<string, MenuCategory[]>) || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Categories</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="section_id">Section</Label>
                <Select value={formData.section_id} onValueChange={(value) => setFormData({ ...formData, section_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections?.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Appetizers, Main Courses, Cocktails"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingCategory ? 'Update' : 'Create'} Category
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {Object.entries(categoriesBySection).map(([sectionName, sectionCategories]) => (
          <div key={sectionName}>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">{sectionName}</h3>
            <div className="grid gap-3">
              {sectionCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <div>
                          <CardTitle className="text-base">{category.name}</CardTitle>
                          {category.description && (
                            <CardDescription className="text-sm">{category.description}</CardDescription>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCategoryManager;

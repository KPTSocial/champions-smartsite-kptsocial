
import React, { useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

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

  const reorderMutation = useMutation({
    mutationFn: async (updates: { id: string; sort_order: number }[]) => {
      for (const update of updates) {
        const { error } = await supabase
          .from('menu_categories')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
      toast.success('Categories reordered successfully');
    },
    onError: (error: any) => {
      toast.error(`Error reordering categories: ${error.message}`);
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

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid droppable or in the same position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    // Only allow reordering within the same section
    if (destination.droppableId !== source.droppableId) {
      toast.error('Categories can only be reordered within the same section');
      return;
    }

    const sectionId = source.droppableId;
    const sectionCategories = categories?.filter(c => c.section_id === sectionId) || [];
    
    // Create a new array with the reordered categories
    const reordered = Array.from(sectionCategories);
    const [movedItem] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, movedItem);

    // Calculate new sort orders
    const updates = reordered.map((category, index) => ({
      id: category.id,
      sort_order: index + 1
    }));

    reorderMutation.mutate(updates);
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading categories...</div>;
  }

  // Group categories by section_id for proper droppable areas
  const categoriesBySectionId = categories?.reduce((acc, category) => {
    if (!acc[category.section_id]) {
      acc[category.section_id] = [];
    }
    acc[category.section_id].push(category);
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          {sections?.map((section) => {
            const sectionCategories = categoriesBySectionId[section.id] || [];
            return (
              <div key={section.id}>
                <h3 className="text-lg font-semibold mb-3 text-muted-foreground">{section.name}</h3>
                <Droppable droppableId={section.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`grid gap-3 min-h-[50px] rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? 'bg-accent/50' : ''
                      }`}
                    >
                      {sectionCategories.map((category, index) => (
                        <Draggable key={category.id} draggableId={category.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`transition-shadow ${
                                snapshot.isDragging ? 'shadow-lg opacity-90' : ''
                              }`}
                            >
                              <CardHeader className="py-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab active:cursor-grabbing"
                                    >
                                      <GripVertical className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                    </div>
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
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default MenuCategoryManager;


import React, { useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MenuSection {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_visible: boolean;
}

const MenuSectionManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<MenuSection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sort_order: 0
  });

  const queryClient = useQueryClient();

  const { data: sections, isLoading } = useQuery({
    queryKey: ['menu-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_sections')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      return data as MenuSection[];
    }
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['menu-sections'] });
    queryClient.invalidateQueries({ queryKey: ['menuData'] });
  };

  const createMutation = useMutation({
    mutationFn: async (newSection: Omit<MenuSection, 'id'>) => {
      const { data, error } = await supabase
        .from('menu_sections')
        .insert(newSection)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidate();
      toast.success('Section created successfully');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => toast.error(`Error creating section: ${error.message}`)
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MenuSection> & { id: string }) => {
      const { data, error } = await supabase
        .from('menu_sections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidate();
      toast.success('Section updated successfully');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => toast.error(`Error updating section: ${error.message}`)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('menu_sections').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success('Section deleted successfully');
    },
    onError: (error: any) => toast.error(`Error deleting section: ${error.message}`)
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase
        .from('menu_sections')
        .update({ is_visible })
        .eq('id', id);
      if (error) throw error;
      return { id, is_visible };
    },
    onSuccess: ({ is_visible }) => {
      invalidate();
      toast.success(is_visible ? 'Section is now visible to the public' : 'Section hidden from public site');
    },
    onError: (error: any) => toast.error(`Error updating visibility: ${error.message}`)
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', sort_order: 0 });
    setEditingSection(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSection) {
      updateMutation.mutate({ ...formData, id: editingSection.id });
    } else {
      const maxSortOrder = Math.max(...(sections?.map(s => s.sort_order) || [0]));
      createMutation.mutate({ ...formData, sort_order: maxSortOrder + 1, is_visible: true });
    }
  };

  const handleEdit = (section: MenuSection) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      description: section.description || '',
      sort_order: section.sort_order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this section? This will also delete all categories and items within it.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading sections...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Sections</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSection ? 'Edit Section' : 'Create New Section'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Section Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Food Menu, Beverage Menu"
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
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                  min="0"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingSection ? 'Update' : 'Create'} Section
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sections?.map((section) => (
          <Card
            key={section.id}
            className={!section.is_visible ? 'opacity-60 border-dashed' : ''}
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-lg">{section.name}</CardTitle>
                      {!section.is_visible && (
                        <Badge variant="outline" className="border-amber-500 text-amber-600 gap-1">
                          <EyeOff className="h-3 w-3" /> Hidden from public
                        </Badge>
                      )}
                    </div>
                    {section.description && (
                      <CardDescription>{section.description}</CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1.5 mr-1"
                    title={section.is_visible ? 'Visible to public' : 'Hidden from public'}
                  >
                    {section.is_visible ? (
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <Switch
                      checked={section.is_visible}
                      onCheckedChange={(checked) =>
                        toggleVisibilityMutation.mutate({ id: section.id, is_visible: checked })
                      }
                      aria-label="Toggle section visibility"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(section)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(section.id)}
                    className="text-destructive hover:text-destructive"
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
  );
};

export default MenuSectionManager;

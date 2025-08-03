import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  GripVertical, 
  Copy, 
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Archive,
  Wand2
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category_id: string;
  is_available: boolean;
  is_featured: boolean;
  is_special: boolean;
  special_start_date: string | null;
  special_end_date: string | null;
  tags: string[] | null;
  sort_order: number;
}

const MonthlySpecialsManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isNextMonthOpen, setIsNextMonthOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    special_start_date: '',
    special_end_date: '',
    tags: ''
  });

  const queryClient = useQueryClient();

  // Get Monthly Specials category ID
  const { data: monthlySpecialsCategory } = useQuery({
    queryKey: ['monthly-specials-category'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('id, name')
        .eq('name', 'Monthly Specials')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Get all monthly specials
  const { data: monthlySpecials, isLoading } = useQuery({
    queryKey: ['monthly-specials-items'],
    queryFn: async () => {
      if (!monthlySpecialsCategory?.id) return [];
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('category_id', monthlySpecialsCategory.id)
        .order('sort_order');
      
      if (error) throw error;
      return data as MenuItem[];
    },
    enabled: !!monthlySpecialsCategory?.id
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (newItem: any) => {
      const { data, error } = await supabase
        .from('menu_items')
        .insert(newItem)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-specials-items'] });
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
      toast.success('Monthly special created successfully');
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-specials-items'] });
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
      toast.success('Monthly special updated successfully');
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-specials-items'] });
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
      toast.success('Monthly special deleted successfully');
    }
  });

  // Bulk operations
  const clearAllSpecialsMutation = useMutation({
    mutationFn: async () => {
      if (!monthlySpecialsCategory?.id) throw new Error('Category not found');
      
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('category_id', monthlySpecialsCategory.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-specials-items'] });
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
      toast.success('All monthly specials cleared');
    }
  });

  const resetSortOrderMutation = useMutation({
    mutationFn: async () => {
      if (!monthlySpecials?.length) return;
      
      const updates = monthlySpecials.map((item, index) => ({
        id: item.id,
        sort_order: index + 1
      }));

      for (const update of updates) {
        await supabase
          .from('menu_items')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-specials-items'] });
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
      toast.success('Sort order reset successfully');
    }
  });

  // Helper functions
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      special_start_date: '',
      special_end_date: '',
      tags: ''
    });
    setEditingItem(null);
  };

  const getNextMonthDates = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    
    return {
      start: nextMonth.toISOString().split('T')[0],
      end: endOfNextMonth.toISOString().split('T')[0]
    };
  };

  const setNextMonthDates = () => {
    const dates = getNextMonthDates();
    setFormData(prev => ({
      ...prev,
      special_start_date: dates.start,
      special_end_date: dates.end
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!monthlySpecialsCategory?.id) {
      toast.error('Monthly Specials category not found');
      return;
    }

    const itemData = {
      ...formData,
      category_id: monthlySpecialsCategory.id,
      price: formData.price ? parseFloat(formData.price) : null,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : null,
      special_start_date: formData.special_start_date || null,
      special_end_date: formData.special_end_date || null,
      is_special: true,
      is_available: true,
      is_featured: false
    };

    if (editingItem) {
      updateMutation.mutate({ ...itemData, id: editingItem.id });
    } else {
      const maxSortOrder = Math.max(...(monthlySpecials?.map(item => item.sort_order) || [0]), 0);
      createMutation.mutate({ ...itemData, sort_order: maxSortOrder + 1 });
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price?.toString() || '',
      image_url: item.image_url || '',
      special_start_date: item.special_start_date || '',
      special_end_date: item.special_end_date || '',
      tags: item.tags?.join(', ') || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const duplicateItem = (item: MenuItem) => {
    setFormData({
      name: `${item.name} (Copy)`,
      description: item.description || '',
      price: item.price?.toString() || '',
      image_url: item.image_url || '',
      special_start_date: item.special_start_date || '',
      special_end_date: item.special_end_date || '',
      tags: item.tags?.join(', ') || ''
    });
    setIsDialogOpen(true);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !monthlySpecials) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    const newItems = Array.from(monthlySpecials);
    const [reorderedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(destinationIndex, 0, reorderedItem);
    
    // Update sort orders for all affected items
    const updates = newItems.map((item, index) => ({
      id: item.id,
      sort_order: index + 1
    }));

    // Execute updates
    updates.forEach(update => {
      updateMutation.mutate(update);
    });

    toast.success('Items reordered successfully');
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading monthly specials...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Monthly Specials Manager</h2>
          <p className="text-muted-foreground">Manage your monthly special menu items with advanced tools</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Special
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Edit Monthly Special' : 'Create New Monthly Special'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Pumpkin Spice Latte"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="12.99"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Delicious monthly special description..."
                  />
                </div>

                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="GF, V, CF, Seasonal"
                  />
                </div>

                {/* Special dates with quick action */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Special Period</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={setNextMonthDates}
                    >
                      <Wand2 className="h-3 w-3 mr-1" />
                      Set Next Month
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="special_start_date">Start Date</Label>
                      <Input
                        id="special_start_date"
                        type="date"
                        value={formData.special_start_date}
                        onChange={(e) => setFormData({ ...formData, special_start_date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="special_end_date">End Date</Label>
                      <Input
                        id="special_end_date"
                        type="date"
                        value={formData.special_end_date}
                        onChange={(e) => setFormData({ ...formData, special_end_date: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingItem ? 'Update' : 'Create'} Special
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Bulk Actions */}
      <Collapsible open={isNextMonthOpen} onOpenChange={setIsNextMonthOpen}>
        <Card>
          <CardHeader>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Quick Actions & Bulk Operations</span>
                </div>
                {isNextMonthOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => resetSortOrderMutation.mutate()}
                  disabled={!monthlySpecials?.length}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Sort Order
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline"
                      disabled={!monthlySpecials?.length}
                      className="text-destructive hover:text-destructive"
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Clear All Specials
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear All Monthly Specials?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all {monthlySpecials?.length || 0} monthly specials. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => clearAllSpecialsMutation.mutate()}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Clear All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button variant="outline" disabled>
                  <Copy className="h-4 w-4 mr-2" />
                  Clone from Template
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Monthly Specials List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Current Monthly Specials ({monthlySpecials?.length || 0})
        </h3>
        
        {!monthlySpecials?.length ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Monthly Specials</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first monthly special.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Special
              </Button>
            </CardContent>
          </Card>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="monthly-specials">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {monthlySpecials.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`transition-all ${
                            snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                          }`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab hover:bg-muted p-2 rounded-md transition-colors"
                                >
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <CardTitle className="text-base">{item.name}</CardTitle>
                                    {item.price && (
                                      <Badge variant="secondary">${item.price}</Badge>
                                    )}
                                    <Badge variant="outline">#{item.sort_order}</Badge>
                                  </div>
                                  {item.description && (
                                    <CardDescription className="mt-1">{item.description}</CardDescription>
                                  )}
                                  {item.special_start_date && item.special_end_date && (
                                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3" />
                                      {item.special_start_date} → {item.special_end_date}
                                    </div>
                                  )}
                                  {item.tags && item.tags.length > 0 && (
                                    <div className="flex gap-1 mt-2">
                                      {item.tags.map((tag, tagIndex) => (
                                        <Badge key={tagIndex} variant="outline" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => duplicateItem(item)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(item)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Monthly Special?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{item.name}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(item.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
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
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default MonthlySpecialsManager;
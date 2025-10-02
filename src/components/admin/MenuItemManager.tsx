
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Search, Star, Clock, Eye, EyeOff, Sparkles, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PdfMenuUploadDialog from './PdfMenuUploadDialog';

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
  category?: {
    name: string;
    section: {
      name: string;
    };
  };
}

interface MenuCategory {
  id: string;
  name: string;
  section: {
    name: string;
  };
}

const MenuItemManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPdfUploadOpen, setIsPdfUploadOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
    is_available: true,
    is_featured: false,
    is_special: false,
    special_start_date: '',
    special_end_date: '',
    tags: ''
  });

  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          category:menu_categories(
            name,
            section:menu_sections(name)
          )
        `)
        .order('category_id')
        .order('sort_order');
      
      if (error) throw error;
      return data as MenuItem[];
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['menu-categories-for-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_categories')
        .select(`
          id,
          name,
          section:menu_sections(name)
        `)
        .order('section_id')
        .order('sort_order');
      
      if (error) throw error;
      return data as MenuCategory[];
    }
  });

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
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
      toast.success('Menu item created successfully');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Error creating item: ${error.message}`);
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
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
      toast.success('Menu item updated successfully');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Error updating item: ${error.message}`);
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
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menuData'] });
      toast.success('Menu item deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting item: ${error.message}`);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      category_id: '',
      is_available: true,
      is_featured: false,
      is_special: false,
      special_start_date: '',
      special_end_date: '',
      tags: ''
    });
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : null,
      special_start_date: formData.special_start_date || null,
      special_end_date: formData.special_end_date || null
    };

    if (editingItem) {
      updateMutation.mutate({ ...itemData, id: editingItem.id });
    } else {
      const itemsInCategory = items?.filter(item => item.category_id === formData.category_id) || [];
      const maxSortOrder = Math.max(...itemsInCategory.map(item => item.sort_order), 0);
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
      category_id: item.category_id,
      is_available: item.is_available,
      is_featured: item.is_featured,
      is_special: item.is_special,
      special_start_date: item.special_start_date || '',
      special_end_date: item.special_end_date || '',
      tags: item.tags?.join(', ') || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      deleteMutation.mutate(id);
    }
  };

  const toggleAvailability = (item: MenuItem) => {
    updateMutation.mutate({
      id: item.id,
      is_available: !item.is_available
    });
  };

  const toggleNewTag = (item: MenuItem) => {
    const currentTags = item.tags || [];
    const hasNewTag = currentTags.includes('NEW');
    const updatedTags = hasNewTag 
      ? currentTags.filter(tag => tag !== 'NEW')
      : [...currentTags, 'NEW'];
    
    updateMutation.mutate({
      id: item.id,
      tags: updatedTags
    });
  };

  // Filter items based on search and category
  const filteredItems = items?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading menu items...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-2xl font-bold">Menu Items</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Menu Item' : 'Create New Menu Item'}
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
                    placeholder="e.g., Buffalo Wings"
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
                <Label htmlFor="category_id">Category</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.section.name} - {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Delicious item description..."
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
                  placeholder="GF, V, CF, Spicy"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_available"
                    checked={formData.is_available}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                  />
                  <Label htmlFor="is_available">Available</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_special"
                    checked={formData.is_special}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_special: checked })}
                  />
                  <Label htmlFor="is_special">Monthly Special</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_new"
                    checked={formData.tags.includes('NEW')}
                    onCheckedChange={(checked) => {
                      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag && tag !== 'NEW');
                      if (checked) tags.push('NEW');
                      setFormData({ ...formData, tags: tags.join(', ') });
                    }}
                  />
                  <Label htmlFor="is_new" className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Mark as New
                  </Label>
                </div>
              </div>

              {/* Special dates - only show if is_special is true */}
              {formData.is_special && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="special_start_date">Special Start Date</Label>
                    <Input
                      id="special_start_date"
                      type="date"
                      value={formData.special_start_date}
                      onChange={(e) => setFormData({ ...formData, special_start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="special_end_date">Special End Date</Label>
                    <Input
                      id="special_end_date"
                      type="date"
                      value={formData.special_end_date}
                      onChange={(e) => setFormData({ ...formData, special_end_date: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingItem ? 'Update' : 'Create'} Item
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.section.name} - {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          onClick={() => setIsPdfUploadOpen(true)}
          className="w-full sm:w-auto"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload PDF
        </Button>
      </div>

      {/* PDF Upload Dialog */}
      <PdfMenuUploadDialog
        open={isPdfUploadOpen}
        onOpenChange={setIsPdfUploadOpen}
        categories={categories || []}
        onImportComplete={() => {
          queryClient.invalidateQueries({ queryKey: ['menu-items'] });
          queryClient.invalidateQueries({ queryKey: ['menuData'] });
        }}
      />

      {/* Menu Items Grid */}
      <div className="grid gap-4">
        {filteredItems?.map((item) => (
          <Card key={item.id} className={!item.is_available ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    {item.price && (
                      <Badge variant="secondary">${item.price}</Badge>
                    )}
                    {item.is_featured && (
                      <Badge variant="default">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {item.is_special && (
                      <Badge variant="destructive">
                        <Clock className="h-3 w-3 mr-1" />
                        Special
                      </Badge>
                    )}
                    {item.tags?.includes('NEW') && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 animate-pulse">
                        <Sparkles className="h-3 w-3 mr-1" />
                        NEW
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <CardDescription>{item.description}</CardDescription>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>{item.category?.section?.name} - {item.category?.name}</span>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex gap-1">
                        {item.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleNewTag(item)}
                    className={item.tags?.includes('NEW') ? 'text-orange-600' : ''}
                    title={item.tags?.includes('NEW') ? 'Remove NEW tag' : 'Mark as NEW'}
                  >
                    <Sparkles className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAvailability(item)}
                    className={item.is_available ? 'text-green-600' : 'text-red-600'}
                  >
                    {item.is_available ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
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

      {filteredItems?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No menu items found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default MenuItemManager;

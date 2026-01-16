import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Clock, Save, Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface BusinessHour {
  id: number;
  day_label: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
  sort_order: number;
}

interface SpecialHour {
  id: number;
  label: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

const HoursOfOperationManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [businessHours, setBusinessHours] = React.useState<BusinessHour[]>([]);
  const [specialHours, setSpecialHours] = React.useState<SpecialHour[]>([]);
  const [hasChanges, setHasChanges] = React.useState(false);

  const { data: fetchedBusinessHours, isLoading: loadingBusiness } = useQuery({
    queryKey: ['admin-business-hours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as BusinessHour[];
    },
  });

  const { data: fetchedSpecialHours, isLoading: loadingSpecial } = useQuery({
    queryKey: ['admin-special-hours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('special_hours')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as SpecialHour[];
    },
  });

  React.useEffect(() => {
    if (fetchedBusinessHours) {
      setBusinessHours(fetchedBusinessHours);
    }
  }, [fetchedBusinessHours]);

  React.useEffect(() => {
    if (fetchedSpecialHours) {
      setSpecialHours(fetchedSpecialHours);
    }
  }, [fetchedSpecialHours]);

  const saveBusinessHoursMutation = useMutation({
    mutationFn: async (hours: BusinessHour[]) => {
      for (const hour of hours) {
        const { error } = await supabase
          .from('business_hours')
          .update({
            day_label: hour.day_label,
            open_time: hour.open_time,
            close_time: hour.close_time,
            is_closed: hour.is_closed,
          })
          .eq('id', hour.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-business-hours'] });
      queryClient.invalidateQueries({ queryKey: ['business-hours'] });
      toast({ title: 'Business hours updated successfully' });
      setHasChanges(false);
    },
    onError: (error) => {
      toast({ title: 'Error updating hours', description: error.message, variant: 'destructive' });
    },
  });

  const saveSpecialHoursMutation = useMutation({
    mutationFn: async (hours: SpecialHour[]) => {
      for (const hour of hours) {
        const { error } = await supabase
          .from('special_hours')
          .update({
            label: hour.label,
            description: hour.description,
            is_active: hour.is_active,
          })
          .eq('id', hour.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-special-hours'] });
      queryClient.invalidateQueries({ queryKey: ['special-hours'] });
      toast({ title: 'Special hours updated successfully' });
      setHasChanges(false);
    },
    onError: (error) => {
      toast({ title: 'Error updating special hours', description: error.message, variant: 'destructive' });
    },
  });

  const addBusinessHourMutation = useMutation({
    mutationFn: async () => {
      const maxSortOrder = Math.max(...businessHours.map(h => h.sort_order), 0);
      const { error } = await supabase
        .from('business_hours')
        .insert({
          day_label: 'New Day',
          open_time: '11:00',
          close_time: '22:00',
          is_closed: false,
          sort_order: maxSortOrder + 1,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-business-hours'] });
      toast({ title: 'New hours entry added' });
    },
    onError: (error) => {
      toast({ title: 'Error adding hours', description: error.message, variant: 'destructive' });
    },
  });

  const deleteBusinessHourMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('business_hours').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-business-hours'] });
      toast({ title: 'Hours entry deleted' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting hours', description: error.message, variant: 'destructive' });
    },
  });

  const addSpecialHourMutation = useMutation({
    mutationFn: async () => {
      const maxSortOrder = Math.max(...specialHours.map(h => h.sort_order), 0);
      const { error } = await supabase
        .from('special_hours')
        .insert({
          label: 'New Special',
          description: 'Description here',
          is_active: true,
          sort_order: maxSortOrder + 1,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-special-hours'] });
      toast({ title: 'New special hours entry added' });
    },
    onError: (error) => {
      toast({ title: 'Error adding special hours', description: error.message, variant: 'destructive' });
    },
  });

  const deleteSpecialHourMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('special_hours').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-special-hours'] });
      toast({ title: 'Special hours entry deleted' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting special hours', description: error.message, variant: 'destructive' });
    },
  });

  const updateBusinessHour = (id: number, field: keyof BusinessHour, value: string | boolean) => {
    setBusinessHours(prev =>
      prev.map(h => (h.id === id ? { ...h, [field]: value } : h))
    );
    setHasChanges(true);
  };

  const updateSpecialHour = (id: number, field: keyof SpecialHour, value: string | boolean) => {
    setSpecialHours(prev =>
      prev.map(h => (h.id === id ? { ...h, [field]: value } : h))
    );
    setHasChanges(true);
  };

  const handleSaveAll = () => {
    saveBusinessHoursMutation.mutate(businessHours);
    saveSpecialHoursMutation.mutate(specialHours);
  };

  const isLoading = loadingBusiness || loadingSpecial;
  const isSaving = saveBusinessHoursMutation.isPending || saveSpecialHoursMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Save Button - Sticky on mobile */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveAll}
          disabled={!hasChanges || isSaving}
          className="gap-2"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save All Changes
        </Button>
      </div>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Business Hours
              </CardTitle>
              <CardDescription>Regular operating hours displayed in the footer</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addBusinessHourMutation.mutate()}
              disabled={addBusinessHourMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {businessHours.map((hour) => (
            <div key={hour.id} className="flex flex-col sm:flex-row gap-3 p-4 border rounded-lg bg-muted/30">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`day-${hour.id}`}>Day(s)</Label>
                <Input
                  id={`day-${hour.id}`}
                  value={hour.day_label}
                  onChange={(e) => updateBusinessHour(hour.id, 'day_label', e.target.value)}
                  placeholder="e.g., Mon - Fri"
                />
              </div>
              <div className="w-full sm:w-32 space-y-2">
                <Label htmlFor={`open-${hour.id}`}>Open</Label>
                <Input
                  id={`open-${hour.id}`}
                  type="time"
                  value={hour.open_time || ''}
                  onChange={(e) => updateBusinessHour(hour.id, 'open_time', e.target.value)}
                  disabled={hour.is_closed}
                />
              </div>
              <div className="w-full sm:w-32 space-y-2">
                <Label htmlFor={`close-${hour.id}`}>Close</Label>
                <Input
                  id={`close-${hour.id}`}
                  type="time"
                  value={hour.close_time || ''}
                  onChange={(e) => updateBusinessHour(hour.id, 'close_time', e.target.value)}
                  disabled={hour.is_closed}
                />
              </div>
              <div className="flex items-end gap-4 pb-1">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`closed-${hour.id}`}
                    checked={hour.is_closed}
                    onCheckedChange={(checked) => updateBusinessHour(hour.id, 'is_closed', checked)}
                  />
                  <Label htmlFor={`closed-${hour.id}`} className="text-sm">Closed</Label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteBusinessHourMutation.mutate(hour.id)}
                  disabled={deleteBusinessHourMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* Special Hours */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Special Hours</CardTitle>
              <CardDescription>Brunch, Happy Hour, and other special timing</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSpecialHourMutation.mutate()}
              disabled={addSpecialHourMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {specialHours.map((hour) => (
            <div key={hour.id} className="flex flex-col sm:flex-row gap-3 p-4 border rounded-lg bg-muted/30">
              <div className="w-full sm:w-40 space-y-2">
                <Label htmlFor={`special-label-${hour.id}`}>Label</Label>
                <Input
                  id={`special-label-${hour.id}`}
                  value={hour.label}
                  onChange={(e) => updateSpecialHour(hour.id, 'label', e.target.value)}
                  placeholder="e.g., Happy Hour"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor={`special-desc-${hour.id}`}>Description</Label>
                <Input
                  id={`special-desc-${hour.id}`}
                  value={hour.description}
                  onChange={(e) => updateSpecialHour(hour.id, 'description', e.target.value)}
                  placeholder="e.g., Mon - Fri 3PM - 6PM"
                />
              </div>
              <div className="flex items-end gap-4 pb-1">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`special-active-${hour.id}`}
                    checked={hour.is_active}
                    onCheckedChange={(checked) => updateSpecialHour(hour.id, 'is_active', checked)}
                  />
                  <Label htmlFor={`special-active-${hour.id}`} className="text-sm">Active</Label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteSpecialHourMutation.mutate(hour.id)}
                  disabled={deleteSpecialHourMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default HoursOfOperationManager;

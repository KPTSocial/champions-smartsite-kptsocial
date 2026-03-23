import React, { useState, useEffect } from 'react';
import { useHeroBadgeAdmin, HeroBadge } from '@/hooks/useHeroBadge';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const db = supabase as any;
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Upload, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

const HeroBadgeManager: React.FC = () => {
  const { data: badge, isLoading } = useHeroBadgeAdmin();
  const queryClient = useQueryClient();

  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (badge) {
      setImageUrl(badge.image_url);
      setIsActive(badge.is_active);
      setHasEndDate(badge.has_end_date);
      setEndDate(badge.end_date ? parseISO(badge.end_date) : undefined);
      setIsDirty(false);
    }
  }, [badge]);

  const markDirty = () => setIsDirty(true);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `hero-badges/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(path, file);

    if (uploadError) {
      toast.error('Failed to upload image: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('photos').getPublicUrl(path);
    setImageUrl(urlData.publicUrl);
    setUploading(false);
    markDirty();
  };

  const handleSave = async () => {
    if (!imageUrl) {
      toast.error('Please upload an image first');
      return;
    }

    setSaving(true);
    const payload = {
      image_url: imageUrl,
      is_active: isActive,
      has_end_date: hasEndDate,
      end_date: hasEndDate && endDate ? format(endDate, 'yyyy-MM-dd') : null,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (badge) {
      ({ error } = await supabase.from('hero_badges').update(payload).eq('id', badge.id));
    } else {
      ({ error } = await supabase.from('hero_badges').insert(payload));
    }

    if (error) {
      toast.error('Failed to save: ' + error.message);
    } else {
      toast.success('Hero badge saved');
      setIsDirty(false);
      queryClient.invalidateQueries({ queryKey: ['hero-badge'] });
      queryClient.invalidateQueries({ queryKey: ['hero-badge-admin'] });
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!badge) return;
    const { error } = await supabase.from('hero_badges').delete().eq('id', badge.id);
    if (error) {
      toast.error('Failed to delete: ' + error.message);
    } else {
      toast.success('Hero badge removed');
      setImageUrl('');
      setIsActive(true);
      setHasEndDate(false);
      setEndDate(undefined);
      setIsDirty(false);
      queryClient.invalidateQueries({ queryKey: ['hero-badge'] });
      queryClient.invalidateQueries({ queryKey: ['hero-badge-admin'] });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Badge</CardTitle>
        <p className="text-sm text-muted-foreground">
          Display a community award badge in the top-left corner of the homepage hero section.
          The badge will appear at twice the size of the navigation logo.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Badge Image</Label>
          {imageUrl ? (
            <div className="flex items-center gap-4">
              <img src={imageUrl} alt="Badge preview" className="h-24 w-auto rounded border object-contain bg-muted p-1" />
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span><Upload className="h-4 w-4 mr-1" /> Replace</span>
                </Button>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          ) : (
            <label className="cursor-pointer inline-block">
              <Button variant="outline" disabled={uploading} asChild>
                <span>
                  {uploading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
                  Upload Image
                </span>
              </Button>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          )}
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-3">
          <Switch
            checked={isActive}
            onCheckedChange={(v) => { setIsActive(v); markDirty(); }}
          />
          <Label>Display on homepage</Label>
        </div>

        {/* End Date */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Switch
              checked={hasEndDate}
              onCheckedChange={(v) => { setHasEndDate(v); if (!v) setEndDate(undefined); markDirty(); }}
            />
            <Label>Has end date</Label>
          </div>
          {hasEndDate && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[240px] justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : 'Pick end date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(d) => { setEndDate(d); markDirty(); }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave} disabled={saving || !isDirty}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
            {badge ? 'Update Badge' : 'Create Badge'}
          </Button>
          {badge && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1" /> Remove
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroBadgeManager;

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Upload, Star, RotateCcw, Trash2 } from 'lucide-react';

interface CardData {
  id: string;
  section_name: string;
  title: string;
  description: string;
  image_url: string | null;
  default_image_url: string | null;
  alt_text: string | null;
}

const EDITABLE_SECTIONS = ['farm_to_table', 'big_screens'];

const HomepageCardsManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [editedCards, setEditedCards] = useState<Record<string, CardData>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);

  const { data: cards, isLoading } = useQuery({
    queryKey: ['homepage-cards-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .in('section_name', EDITABLE_SECTIONS)
        .order('sort_order');
      if (error) throw error;
      return data as CardData[];
    },
  });

  useEffect(() => {
    if (cards && Object.keys(editedCards).length === 0) {
      const map: Record<string, CardData> = {};
      cards.forEach((c) => (map[c.section_name] = { ...c }));
      setEditedCards(map);
    }
  }, [cards]);

  const updateField = (section: string, field: keyof CardData, value: string) => {
    setEditedCards((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    setIsDirty(true);
  };

  const handleImageUpload = async (section: string, file: File) => {
    setUploadingSection(section);
    try {
      const ext = file.name.split('.').pop();
      const path = `homepage-cards/${section}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('menu-pdfs')
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('menu-pdfs').getPublicUrl(path);
      updateField(section, 'image_url', urlData.publicUrl);
      toast.success('Image uploaded');
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploadingSection(null);
    }
  };

  const handleSetAsDefault = async (section: string) => {
    const card = editedCards[section];
    if (!card?.image_url) {
      toast.error('No image to set as default');
      return;
    }
    try {
      const { error } = await supabase
        .from('homepage_content')
        .update({ default_image_url: card.image_url })
        .eq('id', card.id);
      if (error) throw error;
      setEditedCards((prev) => ({
        ...prev,
        [section]: { ...prev[section], default_image_url: card.image_url },
      }));
      queryClient.invalidateQueries({ queryKey: ['homepage-cards-admin'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-content'] });
      toast.success('Default image saved');
    } catch (err: any) {
      toast.error('Failed to set default: ' + err.message);
    }
  };

  const handleRestoreDefault = (section: string) => {
    const card = editedCards[section];
    if (!card?.default_image_url) {
      toast.error('No default image to restore');
      return;
    }
    updateField(section, 'image_url', card.default_image_url);
    toast.success('Default image restored — click Save to apply');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const section of EDITABLE_SECTIONS) {
        const card = editedCards[section];
        if (!card) continue;
        const { error } = await supabase
          .from('homepage_content')
          .update({
            title: card.title,
            description: card.description,
            image_url: card.image_url,
            alt_text: card.alt_text,
          })
          .eq('id', card.id);
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ['homepage-cards-admin'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-content'] });
      setIsDirty(false);
      toast.success('Homepage cards updated!');
    } catch (err: any) {
      toast.error('Save failed: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Edit the two content cards shown on the homepage below the hero section.
      </p>

      {EDITABLE_SECTIONS.map((section) => {
        const card = editedCards[section];
        if (!card) return null;
        return (
          <Card key={section}>
            <CardHeader>
              <CardTitle className="text-lg">{card.title || section}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`${section}-title`}>Title</Label>
                <Input
                  id={`${section}-title`}
                  value={card.title}
                  onChange={(e) => updateField(section, 'title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`${section}-desc`}>Description</Label>
                <Textarea
                  id={`${section}-desc`}
                  value={card.description}
                  onChange={(e) => updateField(section, 'description', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label>Current Image</Label>
                {card.image_url && (
                  <img
                    src={card.image_url}
                    alt={card.alt_text || card.title}
                    className="w-full max-w-xs h-32 object-cover rounded-md border mb-2"
                  />
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={uploadingSection === section}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) handleImageUpload(section, file);
                      };
                      input.click();
                    }}
                  >
                    {uploadingSection === section ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <Upload className="h-4 w-4 mr-1" />
                    )}
                    Upload Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetAsDefault(section)}
                    disabled={!card.image_url}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Set Current as Default
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestoreDefault(section)}
                    disabled={!card.default_image_url}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Restore Default Image
                  </Button>
                </div>
              </div>

              {/* Default image preview */}
              {card.default_image_url && (
                <div>
                  <Label className="text-xs text-muted-foreground">Default (fallback) image</Label>
                  <img
                    src={card.default_image_url}
                    alt="Default fallback"
                    className="w-full max-w-[160px] h-20 object-cover rounded-md border border-dashed mt-1 opacity-75"
                  />
                </div>
              )}

              <div>
                <Label htmlFor={`${section}-alt`}>Alt Text</Label>
                <Input
                  id={`${section}-alt`}
                  value={card.alt_text || ''}
                  onChange={(e) => updateField(section, 'alt_text', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Button onClick={handleSave} disabled={!isDirty || isSaving}>
        {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        Save All Changes
      </Button>
    </div>
  );
};

export default HomepageCardsManager;

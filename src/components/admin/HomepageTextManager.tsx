import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Type, FileText } from 'lucide-react';

interface HomepageTextSettings {
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_text: string;
}

const DEFAULT_VALUES: HomepageTextSettings = {
  hero_title: "Hillsboro's Sports Bar & Flavor Hub",
  hero_subtitle: "Experience the thrill of the game and the taste of locally-sourced, PNW cuisine. Welcome to your new favorite spot.",
  about_title: "A Bar for Champions",
  about_text: "We're more than just a sports bar. We're a family friendly, community hub with a passion for fresh ingredients and unforgettable moments.",
};

const HomepageTextManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<HomepageTextSettings>(DEFAULT_VALUES);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['homepage-text-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('hero_title, hero_subtitle, about_title, about_text')
        .eq('id', 1)
        .single();

      if (error) {
        console.error('Error fetching homepage text settings:', error);
        return DEFAULT_VALUES;
      }

      return {
        hero_title: (data as any)?.hero_title || DEFAULT_VALUES.hero_title,
        hero_subtitle: (data as any)?.hero_subtitle || DEFAULT_VALUES.hero_subtitle,
        about_title: (data as any)?.about_title || DEFAULT_VALUES.about_title,
        about_text: (data as any)?.about_text || DEFAULT_VALUES.about_text,
      };
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: HomepageTextSettings) => {
      const { error } = await supabase
        .from('site_settings')
        .update({
          hero_title: data.hero_title,
          hero_subtitle: data.hero_subtitle,
          about_title: data.about_title,
          about_text: data.about_text,
        } as any)
        .eq('id', 1);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Homepage text has been updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['homepage-text-settings'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-settings'] });
      setHasChanges(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update homepage text.',
        variant: 'destructive',
      });
    },
  });

  const handleChange = (field: keyof HomepageTextSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleReset = () => {
    if (settings) {
      setFormData(settings);
      setHasChanges(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Homepage Text</h2>
          <p className="text-sm text-muted-foreground">
            Edit the text displayed on the homepage
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset} disabled={updateMutation.isPending}>
              Discard Changes
            </Button>
          )}
          <Button onClick={handleSave} disabled={!hasChanges || updateMutation.isPending}>
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Hero Section</CardTitle>
          </div>
          <CardDescription>
            The main banner area visitors see first when they land on your homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero_title">Hero Title</Label>
            <Input
              id="hero_title"
              value={formData.hero_title}
              onChange={(e) => handleChange('hero_title', e.target.value)}
              placeholder="Enter the main headline..."
            />
            <p className="text-xs text-muted-foreground">
              The main headline (recommended: 5-8 words)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
            <Textarea
              id="hero_subtitle"
              value={formData.hero_subtitle}
              onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              placeholder="Enter the welcoming message..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Welcoming message below the title (1-2 sentences)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">About Section</CardTitle>
          </div>
          <CardDescription>
            The section below the hero with feature cards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="about_title">Section Title</Label>
            <Input
              id="about_title"
              value={formData.about_title}
              onChange={(e) => handleChange('about_title', e.target.value)}
              placeholder="Enter the section headline..."
            />
            <p className="text-xs text-muted-foreground">
              Headline for the feature cards section
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="about_text">Section Description</Label>
            <Textarea
              id="about_text"
              value={formData.about_text}
              onChange={(e) => handleChange('about_text', e.target.value)}
              placeholder="Enter the section description..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Description that appears under the section title
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomepageTextManager;

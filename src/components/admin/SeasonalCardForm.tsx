import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Upload, Calendar, Mail, Phone, ExternalLink } from 'lucide-react';
import { SeasonalEventCard, SeasonalEventCardInsert, uploadSeasonalCardImage } from '@/services/seasonalCardService';
import { useToast } from '@/hooks/use-toast';

interface SeasonalCardFormProps {
  card?: SeasonalEventCard | null;
  onSubmit: (data: SeasonalEventCardInsert) => Promise<void>;
  onCancel: () => void;
  maxSortOrder: number;
}

const iconOptions = [
  { value: 'calendar', label: 'Calendar', icon: Calendar },
  { value: 'mail', label: 'Email', icon: Mail },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'external-link', label: 'External Link', icon: ExternalLink },
];

export function SeasonalCardForm({ card, onSubmit, onCancel, maxSortOrder }: SeasonalCardFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<SeasonalEventCardInsert>({
    title: '',
    emoji: '🎉',
    description: '',
    details: [],
    cta_text: 'Learn More',
    cta_href: '/',
    cta_icon: 'calendar',
    cta_external: false,
    background_image_url: null,
    sort_order: maxSortOrder + 1,
    is_visible: true,
  });

  const [newDetail, setNewDetail] = useState('');

  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title,
        emoji: card.emoji,
        description: card.description,
        details: card.details || [],
        cta_text: card.cta_text,
        cta_href: card.cta_href,
        cta_icon: card.cta_icon,
        cta_external: card.cta_external,
        background_image_url: card.background_image_url,
        sort_order: card.sort_order,
        is_visible: card.is_visible,
      });
      setImagePreview(card.background_image_url);
    }
  }, [card]);

  const handleInputChange = (field: keyof SeasonalEventCardInsert, value: string | boolean | number | string[] | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddDetail = () => {
    if (newDetail.trim()) {
      setFormData(prev => ({
        ...prev,
        details: [...prev.details, newDetail.trim()]
      }));
      setNewDetail('');
    }
  };

  const handleRemoveDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image under 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      const url = await uploadSeasonalCardImage(file);
      setFormData(prev => ({ ...prev, background_image_url: url }));
      setImagePreview(url);
      toast({
        title: 'Image uploaded',
        description: 'Background image has been uploaded successfully.',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for the card.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: 'Description required',
        description: 'Please enter a description for the card.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title and Emoji */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <Label htmlFor="emoji">Emoji</Label>
          <Input
            id="emoji"
            value={formData.emoji}
            onChange={(e) => handleInputChange('emoji', e.target.value)}
            placeholder="🎉"
            className="text-2xl text-center"
          />
        </div>
        <div className="col-span-3">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Event Title"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the event..."
          rows={4}
          required
        />
      </div>

      {/* Details */}
      <div>
        <Label>Details (dates, times, etc.)</Label>
        <div className="space-y-2 mt-2">
          {formData.details.map((detail, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input value={detail} disabled className="flex-1" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveDetail(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Input
              value={newDetail}
              onChange={(e) => setNewDetail(e.target.value)}
              placeholder="Add a detail line..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddDetail();
                }
              }}
            />
            <Button type="button" variant="outline" size="icon" onClick={handleAddDetail}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border rounded-lg p-4 space-y-4">
        <Label className="text-base font-semibold">Call to Action Button</Label>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cta_text">Button Text</Label>
            <Input
              id="cta_text"
              value={formData.cta_text}
              onChange={(e) => handleInputChange('cta_text', e.target.value)}
              placeholder="Learn More"
            />
          </div>
          <div>
            <Label htmlFor="cta_icon">Icon</Label>
            <Select
              value={formData.cta_icon}
              onValueChange={(value) => handleInputChange('cta_icon', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      <opt.icon className="h-4 w-4" />
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="cta_href">Link URL</Label>
          <Input
            id="cta_href"
            value={formData.cta_href}
            onChange={(e) => handleInputChange('cta_href', e.target.value)}
            placeholder="/reservations or mailto:email@example.com"
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="cta_external"
            checked={formData.cta_external}
            onCheckedChange={(checked) => handleInputChange('cta_external', checked)}
          />
          <Label htmlFor="cta_external" className="font-normal">Open in new tab</Label>
        </div>
      </div>

      {/* Background Image */}
      <div>
        <Label>Background Image</Label>
        <div className="mt-2 space-y-3">
          {imagePreview && (
            <div className="relative w-full h-32 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => {
                  setImagePreview(null);
                  setFormData(prev => ({ ...prev, background_image_url: null }));
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploadingImage}
              className="hidden"
              id="image-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={isUploadingImage}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploadingImage ? 'Uploading...' : 'Upload Image'}
            </Button>
            <span className="text-sm text-muted-foreground">or paste an image URL:</span>
          </div>
          <Input
            value={formData.background_image_url || ''}
            onChange={(e) => {
              handleInputChange('background_image_url', e.target.value || null);
              setImagePreview(e.target.value || null);
            }}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      {/* Visibility Toggle */}
      <div className="flex items-center gap-2">
        <Switch
          id="is_visible"
          checked={formData.is_visible}
          onCheckedChange={(checked) => handleInputChange('is_visible', checked)}
        />
        <Label htmlFor="is_visible" className="font-normal">Visible on public site</Label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : card ? 'Update Card' : 'Create Card'}
        </Button>
      </div>
    </form>
  );
}

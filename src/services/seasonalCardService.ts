import { supabase } from '@/integrations/supabase/client';

export interface SeasonalEventCard {
  id: string;
  title: string;
  emoji: string;
  description: string;
  details: string[];
  cta_text: string;
  cta_href: string;
  cta_icon: string;
  cta_external: boolean;
  background_image_url: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export type SeasonalEventCardInsert = Omit<SeasonalEventCard, 'id' | 'created_at' | 'updated_at'>;
export type SeasonalEventCardUpdate = Partial<SeasonalEventCardInsert>;

// Fetch all cards (admin view - includes hidden)
export async function getSeasonalCardsAdmin(): Promise<SeasonalEventCard[]> {
  const { data, error } = await supabase
    .from('seasonal_event_cards')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching seasonal cards:', error);
    throw error;
  }

  return data || [];
}

// Fetch visible cards only (public view)
export async function getSeasonalCardsPublic(): Promise<SeasonalEventCard[]> {
  const { data, error } = await supabase
    .from('seasonal_event_cards')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching public seasonal cards:', error);
    throw error;
  }

  return data || [];
}

// Create a new card
export async function createSeasonalCard(card: SeasonalEventCardInsert): Promise<SeasonalEventCard> {
  const { data, error } = await supabase
    .from('seasonal_event_cards')
    .insert(card)
    .select()
    .single();

  if (error) {
    console.error('Error creating seasonal card:', error);
    throw error;
  }

  return data;
}

// Update an existing card
export async function updateSeasonalCard(id: string, updates: SeasonalEventCardUpdate): Promise<SeasonalEventCard> {
  const { data, error } = await supabase
    .from('seasonal_event_cards')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating seasonal card:', error);
    throw error;
  }

  return data;
}

// Delete a card
export async function deleteSeasonalCard(id: string): Promise<void> {
  const { error } = await supabase
    .from('seasonal_event_cards')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting seasonal card:', error);
    throw error;
  }
}

// Toggle visibility
export async function toggleSeasonalCardVisibility(id: string, isVisible: boolean): Promise<SeasonalEventCard> {
  return updateSeasonalCard(id, { is_visible: isVisible });
}

// Update sort orders for multiple cards
export async function updateSeasonalCardSortOrders(updates: { id: string; sort_order: number }[]): Promise<void> {
  // Use Promise.all to update all cards
  const promises = updates.map(({ id, sort_order }) =>
    supabase
      .from('seasonal_event_cards')
      .update({ sort_order })
      .eq('id', id)
  );

  const results = await Promise.all(promises);
  
  const errors = results.filter(r => r.error);
  if (errors.length > 0) {
    console.error('Error updating sort orders:', errors);
    throw new Error('Failed to update sort orders');
  }
}

// Upload image to storage
export async function uploadSeasonalCardImage(file: File): Promise<string> {
  const timestamp = Date.now();
  const ext = file.name.split('.').pop();
  const fileName = `Special Events/seasonal-${timestamp}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName);

  return publicUrl;
}

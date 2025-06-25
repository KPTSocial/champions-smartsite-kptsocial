
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type PhotoBoothPost = Database['public']['Tables']['photo_booth_posts']['Row'];

interface PhotoBoothFilters {
  status?: string;
  eventId?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
}

export const usePhotoBoothPosts = (filters: PhotoBoothFilters = {}) => {
  const [posts, setPosts] = useState<PhotoBoothPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('photo_booth_posts')
        .select(`
          *,
          events(event_title, event_date),
          admin_users(email)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.eventId) {
        query = query.eq('event_id', filters.eventId);
      }
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }
      if (filters.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const updatePostStatus = async (postId: string, status: string, adminNotes?: string) => {
    try {
      const updates: any = { 
        status,
        approved_at: status === 'approved' ? new Date().toISOString() : null
      };
      
      if (adminNotes) {
        updates.admin_notes = adminNotes;
      }

      const { error } = await supabase
        .from('photo_booth_posts')
        .update(updates)
        .eq('id', postId);

      if (error) throw error;
      
      // Refresh the posts
      fetchPosts();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update post' 
      };
    }
  };

  const updatePostTags = async (postId: string, tags: string[]) => {
    try {
      const { error } = await supabase
        .from('photo_booth_posts')
        .update({ tags })
        .eq('id', postId);

      if (error) throw error;
      
      fetchPosts();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update tags' 
      };
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('photo_booth_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      fetchPosts();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete post' 
      };
    }
  };

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
    updatePostStatus,
    updatePostTags,
    deletePost,
  };
};

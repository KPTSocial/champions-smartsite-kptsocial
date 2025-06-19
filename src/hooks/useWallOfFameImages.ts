
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WallOfFameImage {
  src: string;
  alt: string;
  name: string;
}

const fallbackImages = [
  { src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop", alt: "Friends cheering at a concert" },
  { src: "https://images.unsplash.com/photo-1567406991534-e4c32a76f22e?q=80&w=1964&auto=format&fit=crop", alt: "Group of friends taking a selfie" },
  { src: "https://images.unsplash.com/photo-1600891964725-e0a52c03f678?q=80&w=2070&auto=format&fit=crop", alt: "People enjoying a meal together" },
  { src: "https://images.unsplash.com/photo-1522881451255-f5f69c5fdfd7?q=80&w=1974&auto=format&fit=crop", alt: "Friends having fun at a bar" },
  { src: "https://images.unsplash.com/photo-1529156069898-fac51a492240?q=80&w=2070&auto=format&fit=crop", alt: "Group of friends laughing" },
  { src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format=fit=crop", alt: "Interior of a vibrant bar" },
];

export const useWallOfFameImages = () => {
  const [images, setImages] = useState<WallOfFameImage[]>(fallbackImages);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWallOfFameImages = async () => {
      try {
        const { data: files, error } = await supabase.storage
          .from('photos')
          .list('wall-of-fame', {
            limit: 6,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (error) {
          console.error('Error fetching wall of fame images:', error);
          setIsLoading(false);
          return;
        }

        if (files && files.length > 0) {
          const storageImages = files
            .filter(file => file.name !== '.emptyFolderPlaceholder')
            .slice(0, 6)
            .map(file => {
              const { data } = supabase.storage
                .from('photos')
                .getPublicUrl(`wall-of-fame/${file.name}`);
              
              return {
                src: data.publicUrl,
                alt: `Wall of fame photo: ${file.name}`,
                name: file.name
              };
            });

          if (storageImages.length > 0) {
            // Fill remaining slots with fallback images if needed
            const combinedImages = [
              ...storageImages,
              ...fallbackImages.slice(storageImages.length)
            ].slice(0, 6);
            
            setImages(combinedImages);
          }
        }
      } catch (error) {
        console.error('Error in fetchWallOfFameImages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWallOfFameImages();
  }, []);

  return { images, isLoading };
};

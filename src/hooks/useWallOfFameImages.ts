
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WallOfFameImage {
  src: string;
  alt: string;
  name: string;
}

const fallbackImages = [
  { src: "https://res.cloudinary.com/de3djsvlk/image/upload/v1754685671/A7305134_tppl0j.jpg", alt: "Champions Sports Bar photo", name: "champions-photo.jpg" },
  { src: "https://res.cloudinary.com/de3djsvlk/image/upload/v1754685671/A7305134_tppl0j.jpg", alt: "Champions Sports Bar event photo", name: "champions-event.jpg" },
  { src: "https://res.cloudinary.com/de3djsvlk/image/upload/v1754685671/A7305134_tppl0j.jpg", alt: "Champions Sports Bar dining area", name: "champions-dining.jpg" },
  { src: "https://res.cloudinary.com/de3djsvlk/image/upload/v1754685671/A7305134_tppl0j.jpg", alt: "Champions Sports Bar atmosphere", name: "champions-atmosphere.jpg" },
  { src: "https://images.unsplash.com/photo-1529156069898-fac51a492240?q=80&w=2070&auto=format&fit=crop", alt: "Group of friends laughing", name: "fallback-5.jpg" },
  { src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format=fit=crop", alt: "Interior of a vibrant bar", name: "fallback-6.jpg" },
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
            .slice(0, 6) // Use all storage images up to 6
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
            // Use storage images first, fill remaining slots with fallback images only if needed
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

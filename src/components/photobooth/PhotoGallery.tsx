
import React from 'react';
import { useWallOfFameImages } from '@/hooks/useWallOfFameImages';

const PhotoGallery: React.FC = () => {
  const { images, isLoading } = useWallOfFameImages();

  if (isLoading) {
    return (
      <div className="lg:col-span-3">
        <h2 className="text-3xl font-serif font-semibold mb-6">Wall of Fame</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-md">
              <div className="w-full aspect-square bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3">
      <h2 className="text-3xl font-serif font-semibold mb-6">Wall of Fame</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow-md group">
            <img 
              src={image.src} 
              alt={image.alt} 
              className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.src = "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;

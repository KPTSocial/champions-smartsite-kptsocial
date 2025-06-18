
import React from 'react';

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop", alt: "Friends cheering at a concert" },
  { src: "https://images.unsplash.com/photo-1567406991534-e4c32a76f22e?q=80&w=1964&auto=format&fit=crop", alt: "Group of friends taking a selfie" },
  { src: "https://images.unsplash.com/photo-1600891964725-e0a52c03f678?q=80&w=2070&auto=format&fit=crop", alt: "People enjoying a meal together" },
  { src: "https://images.unsplash.com/photo-1522881451255-f5f69c5fdfd7?q=80&w=1974&auto=format&fit=crop", alt: "Friends having fun at a bar" },
  { src: "https://images.unsplash.com/photo-1529156069898-fac51a492240?q=80&w=2070&auto=format&fit=crop", alt: "Group of friends laughing" },
  { src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format=fit=crop", alt: "Interior of a vibrant bar" },
];

const PhotoGallery: React.FC = () => {
  return (
    <div className="lg:col-span-3">
      <h2 className="text-3xl font-serif font-semibold mb-6">Wall of Fame</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {galleryImages.map((image, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow-md group">
            <img 
              src={image.src} 
              alt={image.alt} 
              className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;

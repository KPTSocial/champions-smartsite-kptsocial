
import React from 'react';
import PhotoBoothForm from '@/components/photobooth/PhotoBoothForm';
import PhotoGallery from '@/components/photobooth/PhotoGallery';
import ValuePropsSection from '@/components/photobooth/ValuePropsSection';

const PhotoBooth = () => {
  return (
    <div className="container py-16 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-serif">Be Part of the Story 📸</h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Share your best moments at Champions and get featured on our wall of fame and social media!
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
        <PhotoBoothForm />
        <PhotoGallery />
      </div>

      <ValuePropsSection />
    </div>
  );
};

export default PhotoBooth;

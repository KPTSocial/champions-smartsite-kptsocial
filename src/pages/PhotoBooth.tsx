
import React, { useState, useEffect } from 'react';
import PhotoBoothForm from '@/components/photobooth/PhotoBoothForm';
import PhotoGallery from '@/components/photobooth/PhotoGallery';
import ValuePropsSection from '@/components/photobooth/ValuePropsSection';
import InstallPrompt from '@/components/ui/install-prompt';
import NetworkStatus from '@/components/ui/network-status';
import { usePWA } from '@/hooks/usePWA';

const PhotoBooth = () => {
  const { isInstallable, isInstalled } = usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Show install prompt after a short delay if app is installable
    if (isInstallable && !isInstalled) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  return (
    <div className="container py-8 md:py-16 lg:py-24 px-4 md:px-6">
      <NetworkStatus />
      
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold font-serif leading-tight">
          Be Part of the Story 📸
        </h1>
        <p className="mt-4 text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
          Share your best moments at Champions and get featured on our wall of fame and social media!
        </p>
      </div>

      <div className="mt-8 md:mt-16 grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
        <PhotoBoothForm />
        <PhotoGallery />
      </div>

      <ValuePropsSection />

      {showInstallPrompt && (
        <InstallPrompt onDismiss={() => setShowInstallPrompt(false)} />
      )}
    </div>
  );
};

export default PhotoBooth;

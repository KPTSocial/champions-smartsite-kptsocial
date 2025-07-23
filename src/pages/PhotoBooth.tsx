import React, { useState, useEffect } from 'react';
import PhotoBoothForm from '@/components/photobooth/PhotoBoothForm';
import PhotoGallery from '@/components/photobooth/PhotoGallery';
import ValuePropsSection from '@/components/photobooth/ValuePropsSection';
import InstallPrompt from '@/components/ui/install-prompt';
import NetworkStatus from '@/components/ui/network-status';
import { usePWA } from '@/hooks/usePWA';
import { BackgroundContainer } from '@/components/ui/background-container';
import { PageHeader } from '@/components/ui/page-header';

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
    <BackgroundContainer
      backgroundImage="https://res.cloudinary.com/de3djsvlk/image/upload/v1753309320/Untitled_design_pruvpx.png"
      className="py-8 md:py-16 lg:py-24"
    >
      <NetworkStatus />
      
      <PageHeader
        title="Be Part of the Story 📸"
        description="Share your best moments at Champions and get featured on our wall of fame and social media!"
      />

      <div className="mt-8 md:mt-16 grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
        <PhotoBoothForm />
        <PhotoGallery />
      </div>

      <ValuePropsSection />

      {showInstallPrompt && (
        <InstallPrompt onDismiss={() => setShowInstallPrompt(false)} />
      )}
    </BackgroundContainer>
  );
};

export default PhotoBooth;
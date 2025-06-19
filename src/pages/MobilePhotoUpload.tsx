
import React from 'react';
import MobilePhotoForm from '@/components/mobile-upload/MobilePhotoForm';
import { useIsMobile } from '@/hooks/use-mobile';

const MobilePhotoUpload = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container max-w-md mx-auto py-4 px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-primary">
            📸 Share Your Moment
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Capture and share your Champions experience!
          </p>
        </div>
        
        <MobilePhotoForm />
        
        {!isMobile && (
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 text-center">
              💡 For the best experience, use your mobile device to take photos directly with your camera.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobilePhotoUpload;

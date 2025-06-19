
import React from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobilePhotoCaptureProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const MobilePhotoCapture: React.FC<MobilePhotoCaptureProps> = ({ 
  onFileChange, 
  fileInputRef 
}) => {
  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="text-center space-y-4">
      <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
        <Camera className="h-16 w-16 text-gray-400 mb-4" />
        <p className="text-gray-600 text-sm mb-2">Ready to capture your moment?</p>
        <p className="text-xs text-gray-500 px-4">
          Tap the button below to open your camera
        </p>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFileChange}
        className="hidden"
        required
      />
      
      <Button 
        type="button"
        onClick={triggerCamera}
        className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
      >
        <Camera className="mr-2 h-5 w-5" />
        Open Camera
      </Button>
      
      <p className="text-xs text-muted-foreground text-center px-4">
        Make sure to allow camera access when prompted
      </p>
    </div>
  );
};

export default MobilePhotoCapture;

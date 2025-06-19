
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MobilePhotoCaptureProps {
  onCapture: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
  onClearPreview: () => void;
}

const MobilePhotoCapture: React.FC<MobilePhotoCaptureProps> = ({
  onCapture,
  imagePreview,
  onClearPreview
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const toggleCamera = () => {
    setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
    // Clear current selection to allow new capture
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="block md:hidden">
      <Card className="border-2 border-dashed border-primary/30">
        <CardContent className="p-4">
          {!imagePreview ? (
            <div className="text-center space-y-4">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-4 rounded-full bg-primary/10">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Take a Photo</h3>
                  <p className="text-sm text-muted-foreground">
                    Capture your Champions moment
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button
                  type="button"
                  onClick={handleCameraClick}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Open Camera
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={toggleCamera}
                  className="w-full"
                  size="sm"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {cameraFacing === 'environment' ? 'Rear Camera' : 'Front Camera'}
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture={cameraFacing}
                onChange={onCapture}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Captured photo" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={onClearPreview}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCameraClick}
                  className="flex-1"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Retake
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MobilePhotoCapture;

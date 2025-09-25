
import React, { useRef, useState } from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { X, Camera, Upload, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoUploadFieldProps {
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearPreview: () => void;
  field: any;
}

const PhotoUploadField: React.FC<PhotoUploadFieldProps> = ({
  imagePreview,
  onFileChange,
  onClearPreview,
  field
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const mockEvent = {
        target: { files }
      } as React.ChangeEvent<HTMLInputElement>;
      
      field.onChange(files);
      onFileChange(mockEvent);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.files);
    onFileChange(e);
  };

  return (
    <FormItem className="space-y-4">
      <FormLabel className="text-base font-medium">Upload Your Photo</FormLabel>
      <FormControl>
        <div className="space-y-6">
          {!imagePreview ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer group",
                isDragging 
                  ? "border-primary bg-primary/5 scale-[1.02]" 
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
              )}
              onClick={handleUploadClick}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={cn(
                  "p-4 rounded-full transition-colors duration-200",
                  isDragging 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-primary/10 text-primary group-hover:bg-primary/20"
                )}>
                  <Camera className="h-8 w-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Take or Upload Photo</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Tap to open camera or drag and drop an image here
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Image className="h-3 w-3" />
                    <span>JPG, PNG, WebP</span>
                  </div>
                  <div className="w-1 h-1 bg-muted-foreground/50 rounded-full"></div>
                  <span>Max 5MB</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative group">
                <div className="relative overflow-hidden rounded-xl border bg-card">
                  <img 
                    src={imagePreview} 
                    alt="Photo preview" 
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleUploadClick}
                        className="bg-white/90 text-black hover:bg-white"
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        Retake
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={onClearPreview}
                        className="bg-red-500/90 hover:bg-red-500"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Photo ready to submit</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleUploadClick}
                  className="text-green-700 hover:bg-green-100"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Change
                </Button>
              </div>
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default PhotoUploadField;

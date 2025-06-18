
import React from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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
  return (
    <FormItem>
      <FormLabel>Upload Photo</FormLabel>
      <FormControl>
        <div className="space-y-4">
          <Input 
            type="file" 
            accept="image/*" 
            capture="environment"
            onChange={(e) => {
              field.onChange(e.target.files);
              onFileChange(e);
            }}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
          />
          {imagePreview && (
            <div className="relative inline-block">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-w-full h-48 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={onClearPreview}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default PhotoUploadField;

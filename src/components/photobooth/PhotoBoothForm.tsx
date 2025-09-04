
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { photoFormSchema, type PhotoFormValues } from '@/lib/validations/photoBoothForm';
import { submitPhotoBoothForm } from '@/utils/photoBoothSubmission';
import { compressImage } from '@/utils/imageCompression';
import PhotoUploadField from './PhotoUploadField';
import PersonalInfoFields from './form-fields/PersonalInfoFields';
import CaptionFields from './form-fields/CaptionFields';
import ConsentField from './form-fields/ConsentField';
import AdvancedOptionsFields from './form-fields/AdvancedOptionsFields';
import MobilePhotoCapture from './MobilePhotoCapture';

const PhotoBoothForm: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<PhotoFormValues>({
    resolver: zodResolver(photoFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      caption: "",
      wantAICaption: false,
      consent: false,
      eventName: "",
      watermarkScale: 0.2,
      watermarkPosition: "south_east",
      tags: "",
    },
  });

  const captionValue = form.watch("caption");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        console.log('Processing file:', file.name, 'Size:', file.size);
        
        // Compress image for mobile
        const compressedFile = await compressImage(file, 1920, 0.8);
        console.log('Compressed file size:', compressedFile.size);
        
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target?.result as string);
        };
        reader.readAsDataURL(compressedFile);
        
        // Update form with compressed file - mobile compatible approach
        // Create a FileList-like array that works on mobile
        const files = [compressedFile] as any;
        files.length = 1;
        files.item = (index: number) => index === 0 ? compressedFile : null;
        
        form.setValue('picture', files, { 
          shouldValidate: true,
          shouldDirty: true 
        });
        
        // Clear any previous errors
        form.clearErrors('picture');
        
        console.log('File set successfully');
      } catch (error) {
        console.error('Error processing image:', error);
        toast({
          title: "Image Processing Error",
          description: "Failed to process the image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    form.setValue('picture', null);
  };

  const onSubmit = async (values: PhotoFormValues) => {
    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await submitPhotoBoothForm(values);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Haptic feedback if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }

      toast({
        title: '🎉 Submission Successful!',
        description: "Thanks for sharing! We'll review your photo shortly.",
      });
      
      form.reset();
      setImagePreview(null);
      setUploadProgress(0);

    } catch (err: any) {
      setUploadProgress(0);
      toast({
        title: "Upload Failed",
        description: err.message || "Something went wrong during your upload.",
        variant: "destructive",
      });
      console.error("PhotoBooth upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:col-span-2">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl md:text-3xl font-serif font-semibold">Submit Your Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PersonalInfoFields control={form.control} />
              
              <FormField control={form.control} name="picture" render={({ field, fieldState }) => (
                <div className="space-y-4">
                  <MobilePhotoCapture
                    onCapture={handleFileChange}
                    imagePreview={imagePreview}
                    onClearPreview={clearImagePreview}
                  />
                  <PhotoUploadField
                    imagePreview={imagePreview}
                    onFileChange={handleFileChange}
                    onClearPreview={clearImagePreview}
                    field={field}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )} />
              
              <CaptionFields control={form.control} captionValue={captionValue} />
              
              <ConsentField control={form.control} />
              
              <AdvancedOptionsFields control={form.control} />
              
              {isLoading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium" 
                disabled={isLoading}
              >
                {isLoading ? 
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                    Submitting...
                  </> : 
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Submit Photo
                  </>
                }
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoBoothForm;


import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { mobilePhotoSchema, type MobilePhotoValues } from '@/lib/validations/mobilePhoto';
import { submitPhotoBoothForm } from '@/utils/photoBoothSubmission';
import MobilePhotoCapture from './MobilePhotoCapture';
import MobilePersonalFields from './MobilePersonalFields';
import MobileConsentField from './MobileConsentField';

const MobilePhotoForm: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<MobilePhotoValues>({
    resolver: zodResolver(mobilePhotoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      consent: false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('picture', e.target.files);
    }
  };

  const retakePhoto = () => {
    setImagePreview(null);
    form.setValue('picture', null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmit = async (values: MobilePhotoValues) => {
    setIsLoading(true);

    try {
      // Convert to PhotoFormValues format for existing submission function
      const formattedValues = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        picture: values.picture,
        caption: "", // Mobile form doesn't include caption
        wantAICaption: true, // Auto-enable AI caption for mobile uploads
        consent: values.consent,
      };

      await submitPhotoBoothForm(formattedValues);

      setShowSuccessMessage(true);
      
      toast({
        title: '🎉 Photo Uploaded!',
        description: "Thanks for sharing! We'll review your photo shortly.",
      });
      
      // Reset form after success
      setTimeout(() => {
        form.reset();
        setImagePreview(null);
        setShowSuccessMessage(false);
      }, 3000);

    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "Something went wrong during your upload.",
        variant: "destructive",
      });
      console.error("Mobile photo upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccessMessage) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="text-center py-8">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-xl font-semibold text-green-800 mb-2">Success!</h2>
          <p className="text-green-700 mb-4">Your photo has been uploaded successfully!</p>
          <Button 
            onClick={() => setShowSuccessMessage(false)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Camera className="mr-2 h-4 w-4" />
            Take Another Photo
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!imagePreview ? (
              <MobilePhotoCapture
                onFileChange={handleFileChange}
                fileInputRef={fileInputRef}
              />
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  <Button
                    type="button"
                    onClick={retakePhoto}
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Retake
                  </Button>
                </div>
                
                <MobilePersonalFields control={form.control} />
                <MobileConsentField control={form.control} />
                
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-5 w-5" />
                      Share My Photo
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MobilePhotoForm;

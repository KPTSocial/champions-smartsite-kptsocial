
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
import PhotoUploadField from './PhotoUploadField';
import PersonalInfoFields from './form-fields/PersonalInfoFields';
import CaptionFields from './form-fields/CaptionFields';
import ConsentField from './form-fields/ConsentField';

const PhotoBoothForm: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<PhotoFormValues>({
    resolver: zodResolver(photoFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      caption: "",
      wantAICaption: false,
      consent: false,
    },
  });

  const captionValue = form.watch("caption");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    form.setValue('picture', null);
  };

  const onSubmit = async (values: PhotoFormValues) => {
    setIsLoading(true);

    try {
      await submitPhotoBoothForm(values);

      toast({
        title: '🎉 Submission Successful!',
        description: "Thanks for sharing! We'll review your photo shortly.",
      });
      
      form.reset();
      setImagePreview(null);

    } catch (err: any) {
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
        <CardHeader>
          <CardTitle className="text-3xl font-serif font-semibold">Submit Your Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PersonalInfoFields control={form.control} />
              
              <FormField control={form.control} name="picture" render={({ field }) => (
                <PhotoUploadField
                  imagePreview={imagePreview}
                  onFileChange={handleFileChange}
                  onClearPreview={clearImagePreview}
                  field={field}
                />
              )} />
              
              <CaptionFields control={form.control} captionValue={captionValue} />
              
              <ConsentField control={form.control} />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Photo
                </>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoBoothForm;

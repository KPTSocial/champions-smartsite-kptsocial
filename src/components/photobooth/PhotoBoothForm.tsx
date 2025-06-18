
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadToPhotoBucket } from "@/utils/uploadToPhotoBucket";
import { sendToWebhook, formatDateToMMDDYY } from "@/utils/webhookService";
import { supabase } from "@/integrations/supabase/client";
import PhotoUploadField from './PhotoUploadField';

const photoFormSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  picture: z.any()
    .refine((files) => files?.length === 1, 'A photo is required.')
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine((files) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      return allowedTypes.includes(files?.[0]?.type);
    }, 'Please select a valid image file (JPEG, PNG, WebP, or GIF).'),
  caption: z.string().max(150, { message: 'Caption cannot be more than 150 characters.' }).optional(),
  wantAICaption: z.boolean().optional(),
  consent: z.boolean().refine((val) => val === true, { message: 'You must consent to sharing your photo.' }),
}).refine(
  (data) => data.caption?.trim()?.length || data.wantAICaption,
  { message: "Provide a caption or check the box for AI to create one.", path: ["caption"] }
);

const PhotoBoothForm: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof photoFormSchema>>({
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

  const onSubmit = async (values: z.infer<typeof photoFormSchema>) => {
    setIsLoading(true);

    try {
      const file = values.picture[0];
      const userFullName = `${values.firstName} ${values.lastName}`;
      
      // Upload photo
      const publicUrl = await uploadToPhotoBucket(file, userFullName);
      
      // Write to Supabase
      const { error } = await supabase
        .from("photo_booth_uploads")
        .insert([{
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          user_name: userFullName,
          caption: values.caption?.trim() || null,
          ai_caption_requested: !values.caption?.trim() && values.wantAICaption ? true : false,
          consent_to_share: values.consent,
          image_url: publicUrl,
        }]);
      
      if (error) throw error;

      // Send to webhook
      const now = new Date();
      await sendToWebhook({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        caption: values.caption?.trim() || null,
        imageUrl: publicUrl,
        timestamp: now.toISOString(),
        formattedDate: formatDateToMMDDYY(now),
        aiCaptionRequested: !values.caption?.trim() && values.wantAICaption ? true : false,
      });

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
              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="picture" render={({ field }) => (
                <PhotoUploadField
                  imagePreview={imagePreview}
                  onFileChange={handleFileChange}
                  onClearPreview={clearImagePreview}
                  field={field}
                />
              )} />
              
              <FormField control={form.control} name="caption" render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Caption <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Best night ever at Champions!" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              {!captionValue?.trim() && (
                <FormField control={form.control} name="wantAICaption" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Let AI create a Champions-branded caption for my photo (will use hashtags like #ChampionsLife).
                      </FormLabel>
                    </div>
                  </FormItem>
                )} />
              )}
              
              <FormField control={form.control} name="consent" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I consent to have this photo shared publicly.</FormLabel>
                  </div>
                </FormItem>
              )} />
              
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

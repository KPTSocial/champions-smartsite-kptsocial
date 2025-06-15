import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { Camera, Loader2, PartyPopper, Heart, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadToPhotoBucket } from "@/utils/uploadToPhotoBucket";
import { supabase } from "@/integrations/supabase/client";

// Updated Schema: first/last/email required, caption optional.
const photoFormSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  picture: z.any()
    .refine((files) => files?.length === 1, 'A photo is required.')
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`),
  caption: z.string().max(150, { message: 'Caption cannot be more than 150 characters.' }).optional(),
  wantAICaption: z.boolean().optional(), // Only relevant if no caption
  consent: z.boolean().refine((val) => val === true, { message: 'You must consent to sharing your photo.' }),
}).refine(
  (data) => data.caption?.trim()?.length || data.wantAICaption,
  { message: "Provide a caption or check the box for AI to create one.", path: ["caption"] }
);

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop", alt: "Friends cheering at a concert" },
  { src: "https://images.unsplash.com/photo-1567406991534-e4c32a76f22e?q=80&w=1964&auto=format&fit=crop", alt: "Group of friends taking a selfie" },
  { src: "https://images.unsplash.com/photo-1600891964725-e0a52c03f678?q=80&w=2070&auto=format&fit=crop", alt: "People enjoying a meal together" },
  { src: "https://images.unsplash.com/photo-1522881451255-f5f69c5fdfd7?q=80&w=1974&auto=format&fit=crop", alt: "Friends having fun at a bar" },
  { src: "https://images.unsplash.com/photo-1529156069898-fac51a492240?q=80&w=2070&auto=format&fit=crop", alt: "Group of friends laughing" },
  { src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format=fit=crop", alt: "Interior of a vibrant bar" },
];

const valueProps = [
    {
        icon: Users,
        title: "Build Community",
        description: "Create a living gallery of your patrons, turning customers into community members.",
    },
    {
        icon: Heart,
        title: "Boost Engagement",
        description: "Generate authentic, user-generated content that drives social media interaction.",
    },
    {
        icon: PartyPopper,
        title: "Create Lasting Memories",
        description: "Give your guests a fun, interactive way to remember their great times at Champions.",
    },
];

const PhotoBooth = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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

  // Show AI caption box when caption is empty
  const captionValue = form.watch("caption");
  const wantAICaption = form.watch("wantAICaption");

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

      toast({
        title: '🎉 Submission Successful!',
        description: "Thanks for sharing! We'll review your photo shortly.",
      });
      form.reset();

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
    <div className="container py-16 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-serif">Be Part of the Story 📸</h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Share your best moments at Champions and get featured on our wall of fame and social media!
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-serif font-semibold">Submit Your Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6 bg-accent/20 border-accent/50 text-accent-foreground">
                <Camera className="h-4 w-4" />
                <AlertTitle className="font-semibold">Demo Mode</AlertTitle>
                <AlertDescription>
                  This form is for demonstration. File uploads will be enabled with backend integration.
                </AlertDescription>
              </Alert>
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
                    <FormItem>
                      <FormLabel>Upload Photo</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
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
                  {/* Show AI caption checkbox ONLY when no caption is entered */}
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
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Photo'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <h2 className="text-3xl font-serif font-semibold mb-6">Wall of Fame</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {galleryImages.map((image, index) => (
                  <div key={index} className="overflow-hidden rounded-lg shadow-md group">
                    <img src={image.src} alt={image.alt} className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105"/>
                  </div>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-24 text-center">
          <h2 className="text-4xl font-serif font-semibold">More Than Just Photos</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              This isn't just a feature; it's a tool to build a stronger, more engaged community.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {valueProps.map((prop) => (
                  <div key={prop.title} className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
                          <prop.icon className="w-8 h-8"/>
                      </div>
                      <h3 className="text-xl font-serif font-semibold mb-2">{prop.title}</h3>
                      <p className="text-muted-foreground">{prop.description}</p>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default PhotoBooth;

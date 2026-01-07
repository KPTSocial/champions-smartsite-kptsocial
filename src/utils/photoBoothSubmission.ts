
import { uploadToPhotoBucket } from "@/utils/uploadToPhotoBucket";
import { sendToWebhook, formatDateToMMDDYY } from "@/utils/webhookService";
import { supabase } from "@/integrations/supabase/client";
import type { PhotoFormValues } from "@/lib/validations/photoBoothForm";

export const submitPhotoBoothForm = async (values: PhotoFormValues) => {
  // Get file from FileList or array-like object
  const file = values.picture?.[0] || values.picture?.item?.(0);
  
  if (!file) {
    throw new Error("No image file found. Please select an image.");
  }
  
  console.log('Submitting photo:', file.name, 'Size:', file.size, 'Type:', file.type);
  
  const userFullName = `${values.firstName} ${values.lastName}`;
  
  // Upload photo
  const publicUrl = await uploadToPhotoBucket(file, userFullName);
  console.log('Photo uploaded to:', publicUrl);
  
  // Write to Supabase using photo_booth_posts table
  const { error } = await supabase
    .from("photo_booth_posts")
    .insert([{
      uploaded_by: userFullName,
      caption: values.caption?.trim() || `Photo by ${userFullName}`,
      image_url: publicUrl,
      status: 'pending',
      approved: false,
    }]);
  
  if (error) {
    console.error('Supabase insert error:', error);
    throw error;
  }
  
  console.log('Data saved to Supabase');

  // Send to webhook with enhanced payload
  const now = new Date();
  try {
    // Parse tags from comma-separated string to array
    const tagsArray = values.tags
      ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : undefined;
    
    await sendToWebhook({
      // Core fields
      timestamp: now.toISOString(),
      formatted_date: formatDateToMMDDYY(now),
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      caption_request: !values.caption?.trim() && values.wantAICaption ? true : false,
      event_name: values.eventName || undefined,
      status: 'QUEUED',
      source: 'web',
      
      // File metadata
      original_filename: file.name,
      mime_type: file.type,
      image_url: publicUrl,
      image_data_size: file.size,
      
      // Optional fields
      caption: values.caption?.trim() || null,
      
      // Advanced options
      watermarkScale: values.watermarkScale || 0.2,
      watermarkPosition: values.watermarkPosition || 'south_east',
      shareConsent: values.consent,
      tags: tagsArray,
    });
    console.log('Webhook sent successfully with enhanced payload');
  } catch (webhookError) {
    console.error('Webhook failed but form submission continues:', webhookError);
    // Don't throw - webhook failure shouldn't block the submission
  }
};


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
  
  console.log('Submitting photo:', file.name, 'Size:', file.size);
  
  const userFullName = `${values.firstName} ${values.lastName}`;
  
  // Upload photo
  const publicUrl = await uploadToPhotoBucket(file, userFullName);
  console.log('Photo uploaded to:', publicUrl);
  
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
  
  if (error) {
    console.error('Supabase insert error:', error);
    throw error;
  }
  
  console.log('Data saved to Supabase');

  // Send to webhook
  const now = new Date();
  try {
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
    console.log('Webhook sent successfully');
  } catch (webhookError) {
    console.error('Webhook failed but form submission continues:', webhookError);
    // Don't throw - webhook failure shouldn't block the submission
  }
};

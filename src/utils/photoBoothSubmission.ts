
import { uploadToPhotoBucket } from "@/utils/uploadToPhotoBucket";
import { sendToWebhook, formatDateToMMDDYY } from "@/utils/webhookService";
import { supabase } from "@/integrations/supabase/client";
import type { PhotoFormValues } from "@/lib/validations/photoBoothForm";

export const submitPhotoBoothForm = async (values: PhotoFormValues) => {
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
};

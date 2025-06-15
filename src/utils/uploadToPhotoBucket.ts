
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a photo file to the 'photos' bucket in Supabase Storage.
 * Returns the public URL or throws on error.
 */
export async function uploadToPhotoBucket(file: File, userName: string): Promise<string> {
  const dateStr = new Date().toISOString().split("T")[0];
  const filePath = `photobooth/${userName}-${dateStr}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("photos")
    .upload(filePath, file, { upsert: false });

  if (error) {
    throw error;
  }

  // Construct public URL for the image
  const { data: publicUrlData } = supabase.storage
    .from("photos")
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error("Could not get public URL for uploaded file.");
  }

  return publicUrlData.publicUrl;
}

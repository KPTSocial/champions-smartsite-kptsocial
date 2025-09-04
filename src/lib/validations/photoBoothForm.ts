
import * as z from 'zod';

export const photoFormSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  picture: z.any()
    .refine((files) => {
      // Handle both FileList and array-like objects
      if (!files) return false;
      if (files.length === 1) return true;
      if (Array.isArray(files) && files.length === 1) return true;
      return false;
    }, 'A photo is required.')
    .refine((files) => {
      // Get the first file from FileList or array
      const file = files?.[0] || files?.item?.(0);
      return file?.size <= 5000000;
    }, `Max file size is 5MB.`)
    .refine((files) => {
      // Get the first file from FileList or array
      const file = files?.[0] || files?.item?.(0);
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      return file && allowedTypes.includes(file.type);
    }, 'Please select a valid image file (JPEG, PNG, WebP, or GIF).'),
  caption: z.string().max(150, { message: 'Caption cannot be more than 150 characters.' }).optional(),
  wantAICaption: z.boolean().optional(),
  consent: z.boolean().refine((val) => val === true, { message: 'You must consent to sharing your photo.' }),
}).refine(
  (data) => data.caption?.trim()?.length || data.wantAICaption,
  { message: "Provide a caption or check the box for AI to create one.", path: ["caption"] }
);

export type PhotoFormValues = z.infer<typeof photoFormSchema>;

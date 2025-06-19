
import * as z from 'zod';

export const mobilePhotoSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  picture: z.any()
    .refine((files) => files?.length === 1, 'A photo is required.')
    .refine((files) => files?.[0]?.size <= 10000000, `Max file size is 10MB.`)
    .refine((files) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      return allowedTypes.includes(files?.[0]?.type);
    }, 'Please select a valid image file (JPEG, PNG, WebP, or GIF).'),
  consent: z.boolean().refine((val) => val === true, { message: 'You must consent to sharing your photo.' }),
});

export type MobilePhotoValues = z.infer<typeof mobilePhotoSchema>;

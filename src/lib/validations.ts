import { z } from 'zod';

export const envSchema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    GOOGLE_API_KEY: z.string().min(1),
});

export const enhanceTextSchema = z.object({
    text: z.string().min(1, "Text is required").max(10000, "Text is too long"),
});

export const noteSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().optional(),
    category_id: z.string().uuid().optional(),
});

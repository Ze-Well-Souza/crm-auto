import { z } from 'zod';

export const imageUploadSchema = z.object({
  file: z.any().optional(),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  category: z.enum(['logo', 'banner', 'product', 'icon', 'background', 'other']),
  tags: z.array(z.string()).optional(),
  collection_id: z.string().optional(),
});

export const imageUrlSchema = z.object({
  url: z.string().url('URL inválida'),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  category: z.enum(['logo', 'banner', 'product', 'icon', 'background', 'other']),
  tags: z.array(z.string()).optional(),
  collection_id: z.string().optional(),
});

export type ImageUploadInput = z.infer<typeof imageUploadSchema>;
export type ImageUrlInput = z.infer<typeof imageUrlSchema>;

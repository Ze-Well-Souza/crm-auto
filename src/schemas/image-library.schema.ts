import { z } from 'zod';

// Schema para upload de imagem
export const imageUploadSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  category: z.enum(['logo', 'banner', 'product', 'icon', 'background', 'other']),
  tags: z.array(z.string()).max(10, 'Máximo 10 tags').optional(),
  collection_id: z.string().uuid().optional(),
  file: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024,
    'Arquivo deve ter no máximo 10MB'
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type),
    'Formato de arquivo inválido. Use JPEG, PNG, GIF ou WEBP'
  )
});

// Schema para adicionar imagem via URL
export const imageUrlSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100, 'Título muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  category: z.enum(['logo', 'banner', 'product', 'icon', 'background', 'other']),
  tags: z.array(z.string()).max(10, 'Máximo 10 tags').optional(),
  collection_id: z.string().uuid().optional(),
  url: z.string().url('URL inválida')
});

// Schema para coleção
export const collectionSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional()
});

// Schema para template
export const templateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  category: z.enum(['email', 'social', 'ad', 'document', 'other']),
  template_data: z.record(z.any()),
  is_public: z.boolean().default(false)
});

export type ImageUploadInput = z.infer<typeof imageUploadSchema>;
export type ImageUrlInput = z.infer<typeof imageUrlSchema>;
export type CollectionInput = z.infer<typeof collectionSchema>;
export type TemplateInput = z.infer<typeof templateSchema>;

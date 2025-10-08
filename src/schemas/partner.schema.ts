import { z } from 'zod';

export const createPartnerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome muito longo'),
  cnpj: z.string().optional().nullable(),
  email: z.string().email('Email inválido').optional().nullable(),
  phone: z.string().min(10, 'Telefone inválido').optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().max(2, 'UF deve ter 2 caracteres').optional().nullable(),
  zip_code: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  status: z.enum(['ativo', 'pendente', 'inativo']).default('pendente'),
  rating: z.number().min(0).max(5).optional().nullable(),
  marketplace_id: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updatePartnerSchema = createPartnerSchema.partial();

export const partnerSearchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  minRating: z.number().min(0).max(5).optional(),
});

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>;
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>;
export type PartnerSearchInput = z.infer<typeof partnerSearchSchema>;

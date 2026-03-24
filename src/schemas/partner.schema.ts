import { z } from 'zod';

export const createPartnerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['ativo', 'pendente', 'inativo']).optional(),
  rating: z.number().min(0).max(5).nullable().optional(),
  marketplace_id: z.string().optional(),
  notes: z.string().optional(),
});

export const updatePartnerSchema = createPartnerSchema.partial();

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>;
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>;

import { z } from 'zod';

const orderItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nome do item é obrigatório'),
  quantity: z.number().min(1, 'Quantidade deve ser no mínimo 1'),
  unit_price: z.number().min(0, 'Preço unitário deve ser positivo'),
  total: z.number().min(0, 'Total deve ser positivo'),
});

export const createMarketplaceOrderSchema = z.object({
  partner_id: z.string().min(1, 'Parceiro é obrigatório'),
  order_number: z.string().min(1, 'Número do pedido é obrigatório'),
  customer_name: z.string().min(3, 'Nome do cliente é obrigatório'),
  customer_phone: z.string().optional().nullable(),
  customer_email: z.string().email('Email inválido').optional().nullable(),
  items: z.array(orderItemSchema).min(1, 'Adicione pelo menos um item'),
  total_amount: z.number().min(0, 'Valor total deve ser positivo'),
  status: z.enum(['pendente', 'confirmado', 'em_preparacao', 'pronto', 'em_entrega', 'entregue', 'cancelado']).default('pendente'),
  payment_status: z.enum(['pendente', 'pago', 'estornado']).default('pendente'),
  payment_method: z.string().optional().nullable(),
  delivery_date: z.string().optional().nullable(),
  delivery_address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  marketplace_reference: z.string().optional().nullable(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pendente', 'confirmado', 'em_preparacao', 'pronto', 'em_entrega', 'entregue', 'cancelado']),
  payment_status: z.enum(['pendente', 'pago', 'estornado']).optional(),
});

export const marketplaceOrderSearchSchema = z.object({
  search: z.string().optional(),
  partner_id: z.string().optional(),
  status: z.string().optional(),
  payment_status: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
});

export type CreateMarketplaceOrderInput = z.infer<typeof createMarketplaceOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type MarketplaceOrderSearchInput = z.infer<typeof marketplaceOrderSearchSchema>;

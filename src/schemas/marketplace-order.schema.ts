import { z } from 'zod';

export const orderItemSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
  total: z.number().min(0),
});

export const createMarketplaceOrderSchema = z.object({
  partner_id: z.string().min(1, 'Parceiro é obrigatório'),
  order_number: z.string().min(1, 'Número do pedido é obrigatório'),
  customer_name: z.string().min(1, 'Nome do cliente é obrigatório'),
  customer_phone: z.string().optional(),
  customer_email: z.string().email().optional().or(z.literal('')),
  items: z.array(orderItemSchema).min(1, 'Pelo menos um item é obrigatório'),
  total_amount: z.number().min(0),
  status: z.enum(['pendente', 'confirmado', 'em_preparacao', 'pronto', 'em_entrega', 'entregue', 'cancelado']).optional(),
  payment_status: z.enum(['pendente', 'pago', 'estornado']).optional(),
  payment_method: z.string().optional(),
  delivery_date: z.string().optional(),
  delivery_address: z.string().optional(),
  notes: z.string().optional(),
  marketplace_reference: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pendente', 'confirmado', 'em_preparacao', 'pronto', 'em_entrega', 'entregue', 'cancelado']).optional(),
  payment_status: z.enum(['pendente', 'pago', 'estornado']).optional(),
});

export type CreateMarketplaceOrderInput = z.infer<typeof createMarketplaceOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

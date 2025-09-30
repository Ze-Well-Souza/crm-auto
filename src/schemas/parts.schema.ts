import { z } from 'zod';

// Constantes para categorias e status
export const PART_CATEGORIES = {
  ENGINE: 'engine',
  TRANSMISSION: 'transmission',
  BRAKES: 'brakes',
  SUSPENSION: 'suspension',
  ELECTRICAL: 'electrical',
  BODY: 'body',
  INTERIOR: 'interior',
  FILTERS: 'filters',
  FLUIDS: 'fluids',
  TIRES: 'tires',
  ACCESSORIES: 'accessories',
  TOOLS: 'tools'
} as const;

export const PART_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISCONTINUED: 'discontinued',
  OUT_OF_STOCK: 'out_of_stock'
} as const;

// Validações customizadas
const priceValidation = z.number()
  .min(0, "Preço não pode ser negativo")
  .max(999999.99, "Preço muito alto")
  .multipleOf(0.01, "Preço deve ter no máximo 2 casas decimais");

const quantityValidation = z.number()
  .int("Quantidade deve ser um número inteiro")
  .min(0, "Quantidade não pode ser negativa");

const skuValidation = z.string()
  .min(3, "SKU deve ter pelo menos 3 caracteres")
  .max(50, "SKU deve ter no máximo 50 caracteres")
  .regex(/^[A-Z0-9-_]+$/, "SKU deve conter apenas letras maiúsculas, números, hífens e underscores")
  .trim();

// Schema base para peças
export const partBaseSchema = z.object({
  name: z.string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  
  sku: skuValidation,
  
  description: z.string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),
  
  category: z.enum([
    PART_CATEGORIES.ENGINE,
    PART_CATEGORIES.TRANSMISSION,
    PART_CATEGORIES.BRAKES,
    PART_CATEGORIES.SUSPENSION,
    PART_CATEGORIES.ELECTRICAL,
    PART_CATEGORIES.BODY,
    PART_CATEGORIES.INTERIOR,
    PART_CATEGORIES.FILTERS,
    PART_CATEGORIES.FLUIDS,
    PART_CATEGORIES.TIRES,
    PART_CATEGORIES.ACCESSORIES,
    PART_CATEGORIES.TOOLS
  ], {
    errorMap: () => ({ message: "Categoria inválida" })
  }),
  
  brand: z.string()
    .min(1, "Marca é obrigatória")
    .max(50, "Marca deve ter no máximo 50 caracteres")
    .trim(),
  
  model: z.string()
    .max(50, "Modelo deve ter no máximo 50 caracteres")
    .optional(),
  
  part_number: z.string()
    .max(50, "Número da peça deve ter no máximo 50 caracteres")
    .optional(),
  
  supplier_id: z.string()
    .uuid("ID do fornecedor deve ser um UUID válido")
    .optional(),
  
  cost_price: priceValidation,
  
  sale_price: priceValidation,
  
  quantity_in_stock: quantityValidation,
  
  min_stock_level: quantityValidation,
  
  max_stock_level: quantityValidation.optional(),
  
  location: z.string()
    .max(100, "Localização deve ter no máximo 100 caracteres")
    .optional(),
  
  weight: z.number()
    .min(0, "Peso não pode ser negativo")
    .max(9999.99, "Peso muito alto")
    .optional(),
  
  dimensions: z.string()
    .max(50, "Dimensões devem ter no máximo 50 caracteres")
    .optional(),
  
  warranty_months: z.number()
    .int("Garantia deve ser um número inteiro de meses")
    .min(0, "Garantia não pode ser negativa")
    .max(120, "Garantia máxima é de 120 meses")
    .optional(),
  
  status: z.enum([
    PART_STATUS.ACTIVE,
    PART_STATUS.INACTIVE,
    PART_STATUS.DISCONTINUED,
    PART_STATUS.OUT_OF_STOCK
  ], {
    errorMap: () => ({ message: "Status inválido" })
  }).default(PART_STATUS.ACTIVE),
  
  notes: z.string()
    .max(1000, "Notas devem ter no máximo 1000 caracteres")
    .optional()
});

// Schema para criação de peça
export const createPartSchema = partBaseSchema
  .refine((data) => data.sale_price >= data.cost_price, {
    message: "Preço de venda deve ser maior ou igual ao preço de custo",
    path: ["sale_price"]
  })
  .refine((data) => !data.max_stock_level || data.max_stock_level >= data.min_stock_level, {
    message: "Estoque máximo deve ser maior ou igual ao estoque mínimo",
    path: ["max_stock_level"]
  });

// Schema para atualização de peça
export const updatePartSchema = createPartSchema.partial().extend({
  id: z.string().uuid("ID deve ser um UUID válido")
});

// Schema para busca de peças
export const searchPartSchema = z.object({
  query: z.string().optional(),
  category: z.enum([
    PART_CATEGORIES.ENGINE,
    PART_CATEGORIES.TRANSMISSION,
    PART_CATEGORIES.BRAKES,
    PART_CATEGORIES.SUSPENSION,
    PART_CATEGORIES.ELECTRICAL,
    PART_CATEGORIES.BODY,
    PART_CATEGORIES.INTERIOR,
    PART_CATEGORIES.FILTERS,
    PART_CATEGORIES.FLUIDS,
    PART_CATEGORIES.TIRES,
    PART_CATEGORIES.ACCESSORIES,
    PART_CATEGORIES.TOOLS
  ]).optional(),
  brand: z.string().optional(),
  supplier_id: z.string().uuid().optional(),
  status: z.enum([
    PART_STATUS.ACTIVE,
    PART_STATUS.INACTIVE,
    PART_STATUS.DISCONTINUED,
    PART_STATUS.OUT_OF_STOCK
  ]).optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  low_stock: z.boolean().optional(),
  out_of_stock: z.boolean().optional()
});

// Tipos TypeScript derivados dos schemas
export type PartBase = z.infer<typeof partBaseSchema>;
export type CreatePart = z.infer<typeof createPartSchema>;
export type UpdatePart = z.infer<typeof updatePartSchema>;
export type SearchPart = z.infer<typeof searchPartSchema>;
import { z } from 'zod';

// Schema para validação de valor monetário
const monetaryValueSchema = z.number()
  .positive("Valor deve ser positivo")
  .max(999999999.99, "Valor muito alto")
  .refine((value) => {
    // Verifica se tem no máximo 2 casas decimais
    return Number.isInteger(value * 100);
  }, {
    message: "Valor deve ter no máximo 2 casas decimais"
  });

// Schema para validação de data
const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD")
  .refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, {
    message: "Data inválida"
  });

// Schema principal da transação financeira
export const financialTransactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: "Tipo deve ser 'receita' ou 'despesa'" })
  }),
  
  description: z.string()
    .min(3, "Descrição deve ter pelo menos 3 caracteres")
    .max(200, "Descrição deve ter no máximo 200 caracteres"),
  
  amount: monetaryValueSchema,
  
  category: z.string()
    .min(2, "Categoria deve ter pelo menos 2 caracteres")
    .max(50, "Categoria deve ter no máximo 50 caracteres"),
  
  payment_method: z.string()
    .min(2, "Método de pagamento deve ter pelo menos 2 caracteres")
    .max(50, "Método de pagamento deve ter no máximo 50 caracteres"),
  
  due_date: dateSchema,
  
  payment_date: dateSchema.optional().or(z.literal("")),
  
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled'], {
    errorMap: () => ({ message: "Status inválido" })
  }),
  
  client_id: z.string()
    .uuid("ID do cliente inválido")
    .optional()
    .or(z.literal("")),
  
  notes: z.string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional()
    .or(z.literal(""))
});

// Schema para criação de transação
export const createFinancialTransactionSchema = financialTransactionSchema;

// Schema para atualização de transação
export const updateFinancialTransactionSchema = financialTransactionSchema.partial().extend({
  id: z.string().uuid("ID inválido")
});

// Schema para busca de transações
export const financialTransactionSearchSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['income', 'expense']).optional(),
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled']).optional(),
  category: z.string().optional(),
  payment_method: z.string().optional(),
  client_id: z.string().uuid().optional(),
  amount_from: z.number().positive().optional(),
  amount_to: z.number().positive().optional(),
  due_date_from: dateSchema.optional(),
  due_date_to: dateSchema.optional(),
  payment_date_from: dateSchema.optional(),
  payment_date_to: dateSchema.optional()
});

// Tipos TypeScript derivados dos schemas
export type FinancialTransactionFormData = z.infer<typeof financialTransactionSchema>;
export type CreateFinancialTransactionData = z.infer<typeof createFinancialTransactionSchema>;
export type UpdateFinancialTransactionData = z.infer<typeof updateFinancialTransactionSchema>;
export type FinancialTransactionSearchData = z.infer<typeof financialTransactionSearchSchema>;

// Função utilitária para validar e formatar dados da transação
export const validateAndFormatFinancialTransaction = (data: any): FinancialTransactionFormData => {
  // Limpa e formata os dados antes da validação
  const cleanData = {
    ...data,
    description: data.description?.trim(),
    category: data.category?.trim(),
    payment_method: data.payment_method?.trim(),
    amount: data.amount ? parseFloat(data.amount) : undefined,
    due_date: data.due_date?.trim(),
    payment_date: data.payment_date?.trim() || undefined,
    client_id: data.client_id?.trim() || undefined,
    notes: data.notes?.trim() || undefined
  };

  return financialTransactionSchema.parse(cleanData);
};

// Constantes para tipos de transação
export const TRANSACTION_TYPES = {
  income: 'Receita',
  expense: 'Despesa'
} as const;

// Constantes para status de transação
export const TRANSACTION_STATUS = {
  pending: 'Pendente',
  paid: 'Pago',
  overdue: 'Vencido',
  cancelled: 'Cancelado'
} as const;

// Funções para obter labels
export const getTransactionTypeLabel = (type: string): string => {
  return TRANSACTION_TYPES[type as keyof typeof TRANSACTION_TYPES] || type;
};

export const getTransactionStatusLabel = (status: string): string => {
  return TRANSACTION_STATUS[status as keyof typeof TRANSACTION_STATUS] || status;
};
import { z } from 'zod';

// Schema para validação de CPF/CNPJ
const cpfCnpjSchema = z.string()
  .optional()
  .refine((value) => {
    if (!value) return true; // Campo opcional
    
    // Remove caracteres não numéricos
    const cleanValue = value.replace(/\D/g, '');
    
    // Verifica se é CPF (11 dígitos) ou CNPJ (14 dígitos)
    if (cleanValue.length === 11) {
      // Validação básica de CPF
      return /^\d{11}$/.test(cleanValue) && cleanValue !== '00000000000';
    } else if (cleanValue.length === 14) {
      // Validação básica de CNPJ
      return /^\d{14}$/.test(cleanValue) && cleanValue !== '00000000000000';
    }
    
    return false;
  }, {
    message: "CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos"
  });

// Schema para validação de telefone
const phoneSchema = z.string()
  .optional()
  .refine((value) => {
    if (!value) return true; // Campo opcional
    
    // Remove caracteres não numéricos
    const cleanValue = value.replace(/\D/g, '');
    
    // Aceita telefones com 10 ou 11 dígitos (com ou sem 9 no celular)
    return cleanValue.length >= 10 && cleanValue.length <= 11;
  }, {
    message: "Telefone deve ter entre 10 e 11 dígitos"
  });

// Schema para validação de CEP
const zipCodeSchema = z.string()
  .optional()
  .refine((value) => {
    if (!value) return true; // Campo opcional
    
    // Remove caracteres não numéricos
    const cleanValue = value.replace(/\D/g, '');
    
    // CEP deve ter 8 dígitos
    return cleanValue.length === 8;
  }, {
    message: "CEP deve ter 8 dígitos"
  });

// Schema principal do cliente
export const clientSchema = z.object({
  name: z.string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  
  email: z.string()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  
  phone: phoneSchema,
  
  cpf_cnpj: cpfCnpjSchema,
  
  address: z.string()
    .max(200, "Endereço deve ter no máximo 200 caracteres")
    .optional()
    .or(z.literal("")),
  
  city: z.string()
    .max(100, "Cidade deve ter no máximo 100 caracteres")
    .optional()
    .or(z.literal("")),
  
  state: z.string()
    .length(2, "Estado deve ter 2 caracteres")
    .regex(/^[A-Z]{2}$/, "Estado deve ser uma sigla válida (ex: SP, RJ)")
    .optional()
    .or(z.literal("")),
  
  zip_code: zipCodeSchema,
  
  notes: z.string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional()
    .or(z.literal(""))
});

// Schema para criação de cliente (todos os campos obrigatórios)
export const createClientSchema = clientSchema.extend({
  name: z.string()
    .min(2, "Nome é obrigatório e deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços")
});

// Schema para atualização de cliente (campos opcionais)
export const updateClientSchema = clientSchema.partial().extend({
  id: z.string().uuid("ID inválido")
});

// Schema para busca de clientes
export const clientSearchSchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  hasEmail: z.boolean().optional(),
  hasPhone: z.boolean().optional()
});

// Tipos TypeScript derivados dos schemas
export type ClientFormData = z.infer<typeof clientSchema>;
export type CreateClientData = z.infer<typeof createClientSchema>;
export type UpdateClientData = z.infer<typeof updateClientSchema>;
export type ClientSearchData = z.infer<typeof clientSearchSchema>;

// Função utilitária para validar e formatar dados do cliente
export const validateAndFormatClient = (data: any): ClientFormData => {
  // Limpa e formata os dados antes da validação
  const cleanData = {
    ...data,
    name: data.name?.trim(),
    email: data.email?.trim() || undefined,
    phone: data.phone?.replace(/\D/g, '') || undefined,
    cpf_cnpj: data.cpf_cnpj?.replace(/\D/g, '') || undefined,
    address: data.address?.trim() || undefined,
    city: data.city?.trim() || undefined,
    state: data.state?.toUpperCase().trim() || undefined,
    zip_code: data.zip_code?.replace(/\D/g, '') || undefined,
    notes: data.notes?.trim() || undefined
  };

  return clientSchema.parse(cleanData);
};
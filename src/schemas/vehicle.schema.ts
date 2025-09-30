import { z } from 'zod';

// Schema para validação de placa
const licensePlateSchema = z.string()
  .min(7, "Placa deve ter pelo menos 7 caracteres")
  .max(8, "Placa deve ter no máximo 8 caracteres")
  .regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, "Formato de placa inválido (ex: ABC1234 ou ABC1D23)");

// Schema para validação de ano
const yearSchema = z.number()
  .int("Ano deve ser um número inteiro")
  .min(1900, "Ano deve ser maior que 1900")
  .max(new Date().getFullYear() + 1, `Ano deve ser menor que ${new Date().getFullYear() + 1}`);

// Schema para validação de quilometragem
const mileageSchema = z.number()
  .int("Quilometragem deve ser um número inteiro")
  .min(0, "Quilometragem não pode ser negativa")
  .max(9999999, "Quilometragem muito alta");

// Schema principal do veículo
export const vehicleSchema = z.object({
  client_id: z.string()
    .uuid("ID do cliente inválido"),
  
  brand: z.string()
    .min(2, "Marca deve ter pelo menos 2 caracteres")
    .max(50, "Marca deve ter no máximo 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s\-]+$/, "Marca deve conter apenas letras, espaços e hífens"),
  
  model: z.string()
    .min(1, "Modelo é obrigatório")
    .max(100, "Modelo deve ter no máximo 100 caracteres"),
  
  year: yearSchema,
  
  license_plate: licensePlateSchema,
  
  color: z.string()
    .min(3, "Cor deve ter pelo menos 3 caracteres")
    .max(30, "Cor deve ter no máximo 30 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Cor deve conter apenas letras e espaços"),
  
  fuel_type: z.enum(['gasoline', 'ethanol', 'diesel', 'flex', 'electric', 'hybrid'], {
    errorMap: () => ({ message: "Tipo de combustível inválido" })
  }),
  
  mileage: mileageSchema.optional(),
  
  chassis_number: z.string()
    .length(17, "Número do chassi deve ter 17 caracteres")
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, "Número do chassi inválido")
    .optional()
    .or(z.literal("")),
  
  engine_number: z.string()
    .max(50, "Número do motor deve ter no máximo 50 caracteres")
    .optional()
    .or(z.literal("")),
  
  notes: z.string()
    .max(500, "Observações devem ter no máximo 500 caracteres")
    .optional()
    .or(z.literal(""))
});

// Schema para criação de veículo
export const createVehicleSchema = vehicleSchema;

// Schema para atualização de veículo
export const updateVehicleSchema = vehicleSchema.partial().extend({
  id: z.string().uuid("ID inválido")
});

// Schema para busca de veículos
export const vehicleSearchSchema = z.object({
  search: z.string().optional(),
  client_id: z.string().uuid().optional(),
  brand: z.string().optional(),
  fuel_type: z.enum(['gasoline', 'ethanol', 'diesel', 'flex', 'electric', 'hybrid']).optional(),
  year_from: z.number().int().min(1900).optional(),
  year_to: z.number().int().max(new Date().getFullYear() + 1).optional(),
  mileage_from: z.number().int().min(0).optional(),
  mileage_to: z.number().int().max(9999999).optional()
});

// Tipos TypeScript derivados dos schemas
export type VehicleFormData = z.infer<typeof vehicleSchema>;
export type CreateVehicleData = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleData = z.infer<typeof updateVehicleSchema>;
export type VehicleSearchData = z.infer<typeof vehicleSearchSchema>;

// Função utilitária para validar e formatar dados do veículo
export const validateAndFormatVehicle = (data: any): VehicleFormData => {
  // Limpa e formata os dados antes da validação
  const cleanData = {
    ...data,
    brand: data.brand?.trim(),
    model: data.model?.trim(),
    license_plate: data.license_plate?.toUpperCase().replace(/[^A-Z0-9]/g, ''),
    color: data.color?.trim(),
    chassis_number: data.chassis_number?.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '') || undefined,
    engine_number: data.engine_number?.trim() || undefined,
    notes: data.notes?.trim() || undefined,
    year: data.year ? parseInt(data.year) : undefined,
    mileage: data.mileage ? parseInt(data.mileage) : undefined
  };

  return vehicleSchema.parse(cleanData);
};

// Constantes para tipos de combustível
export const FUEL_TYPES = {
  gasoline: 'Gasolina',
  ethanol: 'Etanol',
  diesel: 'Diesel',
  flex: 'Flex',
  electric: 'Elétrico',
  hybrid: 'Híbrido'
} as const;

// Função para obter label do tipo de combustível
export const getFuelTypeLabel = (fuelType: string): string => {
  return FUEL_TYPES[fuelType as keyof typeof FUEL_TYPES] || fuelType;
};
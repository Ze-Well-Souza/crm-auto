import { z } from 'zod';

// Constantes para tipos e status
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
} as const;

export const APPOINTMENT_TYPES = {
  MAINTENANCE: 'maintenance',
  REPAIR: 'repair',
  INSPECTION: 'inspection',
  CONSULTATION: 'consultation',
  EMERGENCY: 'emergency'
} as const;

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const;

// Validações customizadas
const dateTimeValidation = z.string()
  .datetime({ message: "Data e hora devem estar no formato ISO válido" })
  .refine((date) => new Date(date) > new Date(), {
    message: "Data do agendamento deve ser no futuro"
  });

const timeValidation = z.string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Horário deve estar no formato HH:MM"
  });

const durationValidation = z.number()
  .min(15, "Duração mínima é de 15 minutos")
  .max(480, "Duração máxima é de 8 horas")
  .multipleOf(15, "Duração deve ser múltipla de 15 minutos");

// Schema base para agendamento
export const appointmentBaseSchema = z.object({
  client_id: z.string()
    .min(1, "Cliente é obrigatório")
    .uuid("ID do cliente deve ser um UUID válido"),
  
  vehicle_id: z.string()
    .min(1, "Veículo é obrigatório")
    .uuid("ID do veículo deve ser um UUID válido"),
  
  title: z.string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres")
    .trim(),
  
  description: z.string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),
  
  appointment_date: dateTimeValidation,
  
  start_time: timeValidation,
  
  end_time: timeValidation,
  
  duration_minutes: durationValidation,
  
  type: z.enum([
    APPOINTMENT_TYPES.MAINTENANCE,
    APPOINTMENT_TYPES.REPAIR,
    APPOINTMENT_TYPES.INSPECTION,
    APPOINTMENT_TYPES.CONSULTATION,
    APPOINTMENT_TYPES.EMERGENCY
  ], {
    errorMap: () => ({ message: "Tipo de agendamento inválido" })
  }),
  
  status: z.enum([
    APPOINTMENT_STATUS.SCHEDULED,
    APPOINTMENT_STATUS.CONFIRMED,
    APPOINTMENT_STATUS.IN_PROGRESS,
    APPOINTMENT_STATUS.COMPLETED,
    APPOINTMENT_STATUS.CANCELLED,
    APPOINTMENT_STATUS.NO_SHOW
  ], {
    errorMap: () => ({ message: "Status do agendamento inválido" })
  }),
  
  priority: z.enum([
    PRIORITY_LEVELS.LOW,
    PRIORITY_LEVELS.MEDIUM,
    PRIORITY_LEVELS.HIGH,
    PRIORITY_LEVELS.URGENT
  ], {
    errorMap: () => ({ message: "Nível de prioridade inválido" })
  }).default(PRIORITY_LEVELS.MEDIUM),
  
  estimated_cost: z.number()
    .min(0, "Custo estimado não pode ser negativo")
    .max(999999.99, "Custo estimado muito alto")
    .optional(),
  
  notes: z.string()
    .max(1000, "Notas devem ter no máximo 1000 caracteres")
    .optional(),
  
  reminder_sent: z.boolean().default(false),
  
  created_by: z.string()
    .min(1, "Usuário criador é obrigatório")
    .optional(),
  
  assigned_to: z.string()
    .min(1, "Responsável pelo agendamento")
    .optional()
});

// Schema para criação de agendamento
export const createAppointmentSchema = appointmentBaseSchema.omit({
  created_by: true
});

// Schema para atualização de agendamento
export const updateAppointmentSchema = appointmentBaseSchema.partial().extend({
  id: z.string().uuid("ID deve ser um UUID válido")
});

// Schema para busca de agendamentos
export const searchAppointmentSchema = z.object({
  query: z.string().optional(),
  client_id: z.string().uuid().optional(),
  vehicle_id: z.string().uuid().optional(),
  type: z.enum([
    APPOINTMENT_TYPES.MAINTENANCE,
    APPOINTMENT_TYPES.REPAIR,
    APPOINTMENT_TYPES.INSPECTION,
    APPOINTMENT_TYPES.CONSULTATION,
    APPOINTMENT_TYPES.EMERGENCY
  ]).optional(),
  status: z.enum([
    APPOINTMENT_STATUS.SCHEDULED,
    APPOINTMENT_STATUS.CONFIRMED,
    APPOINTMENT_STATUS.IN_PROGRESS,
    APPOINTMENT_STATUS.COMPLETED,
    APPOINTMENT_STATUS.CANCELLED,
    APPOINTMENT_STATUS.NO_SHOW
  ]).optional(),
  priority: z.enum([
    PRIORITY_LEVELS.LOW,
    PRIORITY_LEVELS.MEDIUM,
    PRIORITY_LEVELS.HIGH,
    PRIORITY_LEVELS.URGENT
  ]).optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  assigned_to: z.string().optional()
});

// Tipos TypeScript derivados dos schemas
export type AppointmentBase = z.infer<typeof appointmentBaseSchema>;
export type CreateAppointment = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointment = z.infer<typeof updateAppointmentSchema>;
export type SearchAppointment = z.infer<typeof searchAppointmentSchema>;
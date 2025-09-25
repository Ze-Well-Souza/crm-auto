// Centralized constants to avoid magic strings and improve maintainability

export const SERVICE_TYPES = [
  "Manutenção Preventiva",
  "Manutenção Corretiva",
  "Troca de Óleo",
  "Revisão Geral",
  "Freios",
  "Suspensão",
  "Motor",
  "Transmissão",
  "Sistema Elétrico",
  "Ar Condicionado",
  "Pneus e Rodas",
  "Outros"
] as const;

export const FUEL_TYPES = [
  "Gasolina",
  "Etanol",
  "Flex",
  "Diesel",
  "GNV",
  "Elétrico",
  "Híbrido"
] as const;

export const PART_CATEGORIES = [
  "Filtros",
  "Freios",
  "Motor",
  "Transmissão",
  "Suspensão",
  "Sistema Elétrico",
  "Ar Condicionado",
  "Pneus e Rodas",
  "Carroceria",
  "Fluidos",
  "Ferramentas",
  "Outros"
] as const;

export const RECEIPT_CATEGORIES = [
  "Serviços Automotivos",
  "Venda de Peças",
  "Manutenção Preventiva",
  "Manutenção Corretiva",
  "Consultoria",
  "Outros Serviços"
] as const;

export const EXPENSE_CATEGORIES = [
  "Compra de Peças",
  "Salários",
  "Aluguel",
  "Energia Elétrica",
  "Telefone/Internet",
  "Combustível",
  "Ferramentas",
  "Marketing",
  "Impostos",
  "Outros"
] as const;

export const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00"
] as const;

export const PAYMENT_METHODS = [
  { id: '1', name: 'Dinheiro', type: 'dinheiro' },
  { id: '2', name: 'Cartão de Crédito', type: 'cartao_credito' },
  { id: '3', name: 'Cartão de Débito', type: 'cartao_debito' },
  { id: '4', name: 'PIX', type: 'pix' },
  { id: '5', name: 'Transferência Bancária', type: 'transferencia' }
] as const;

// Form validation constants
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MIN_APPOINTMENT_DURATION: 15,
  MAX_ADVANCE_BOOKING_DAYS: 90,
  MIN_STOCK_QUANTITY: 0,
  MAX_STOCK_QUANTITY: 9999
} as const;

// Date and time formatting
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  DATETIME: 'dd/MM/yyyy HH:mm'
} as const;
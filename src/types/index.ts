// Centralized type definitions for better type safety and reusability

export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  cpf_cnpj: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  client_id: string;
  brand: string;
  model: string;
  year: number | null;
  license_plate: string | null;
  vin: string | null;
  color: string | null;
  fuel_type: string | null;
  engine: string | null;
  mileage: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  clients?: {
    name: string;
    email: string | null;
  };
}

export interface ServiceOrder {
  id: string;
  order_number: string;
  client_id: string;
  vehicle_id: string | null;
  description: string | null;
  total_labor: number | null;
  total_parts: number | null;
  total_amount: number | null;
  discount: number | null;
  status: string | null;
  mechanic_id: string | null;
  notes: string | null;
  delivered_at: string | null;
  finished_at: string | null;
  started_at: string | null;
  created_at: string;
  updated_at: string;
  clients?: {
    name: string;
    email: string | null;
  };
  vehicles?: {
    brand: string;
    model: string;
    license_plate: string | null;
  };
}

export interface Appointment {
  id: string;
  client_id: string;
  vehicle_id: string | null;
  service_type: string;
  service_description: string | null;
  scheduled_date: string;
  scheduled_time: string;
  estimated_duration: number | null;
  estimated_value: number | null;
  final_value: number | null;
  status: string | null;
  notes: string | null;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  cancelled_by: string | null;
  created_at: string;
  updated_at: string;
  clients?: {
    name: string;
    email: string | null;
    phone: string | null;
  };
  vehicles?: {
    brand: string;
    model: string;
    year: number | null;
    license_plate: string | null;
  };
}

export interface Part {
  id: string;
  code: string | null;
  name: string;
  description: string | null;
  category: string | null;
  brand: string | null;
  supplier_id: string | null;
  cost_price: number | null;
  sale_price: number | null;
  stock_quantity: number | null;
  min_stock: number | null;
  max_stock: number | null;
  location: string | null;
  active: boolean | null;
  created_at: string;
  updated_at: string;
  suppliers?: {
    name: string;
    contact_name: string | null;
  };
}

export interface Supplier {
  id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  cnpj: string | null;
  notes: string | null;
  active: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface FinancialTransaction {
  id: string;
  type: string;
  description: string;
  amount: number;
  category: string | null;
  payment_method: string | null;
  due_date: string | null;
  payment_date: string | null;
  status: string | null;
  service_order_id: string | null;
  client_id: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  clients?: {
    name: string;
    email: string | null;
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: string | null;
  active: boolean | null;
  created_at: string;
}

// Status enums for better type safety
export enum AppointmentStatus {
  AGENDADO = 'agendado',
  CONFIRMADO = 'confirmado',
  EM_ANDAMENTO = 'em_andamento',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado'
}

export enum ServiceOrderStatus {
  ORCAMENTO = 'orcamento',
  APROVADO = 'aprovado',
  EM_ANDAMENTO = 'em_andamento',
  AGUARDANDO_PECAS = 'aguardando_pecas',
  CONCLUIDO = 'concluido',
  ENTREGUE = 'entregue',
  CANCELADO = 'cancelado'
}

export enum TransactionStatus {
  PENDENTE = 'pendente',
  PAGO = 'pago',
  VENCIDO = 'vencido',
  CANCELADO = 'cancelado'
}

export enum TransactionType {
  RECEITA = 'receita',
  DESPESA = 'despesa'
}
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardMetrics {
  totalClients: number;
  totalVehicles: number;
  totalParts: number;
  lowStockParts: number;
  totalRevenue: number;
  totalExpenses: number;
  monthlyRevenue: number;
  totalAppointments: number;
  confirmedAppointments: number;
  pendingAppointments: number;
  totalServiceOrders: number;
  inProgressOrders: number;
  completedServiceOrders: number;
  completionRate: number;
  appointmentRate: number;
  profitMargin: number;
}

async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return getDefaultMetrics();
  }

  // Execute all queries in parallel for maximum efficiency
  const [
    clientsResult,
    vehiclesResult,
    partsResult,
    transactionsResult,
    appointmentsResult,
    serviceOrdersResult
  ] = await Promise.all([
    supabase.from('crm_clients').select('id', { count: 'exact', head: true }).eq('partner_id', user.id),
    supabase.from('crm_vehicles').select('id', { count: 'exact', head: true }).eq('partner_id', user.id),
    supabase.from('crm_parts').select('id, current_stock, min_stock').eq('partner_id', user.id),
    supabase.from('crm_financial_transactions').select('type, amount, status').eq('user_id', user.id),
    supabase.from('crm_appointments').select('status').eq('user_id', user.id),
    supabase.from('crm_service_orders').select('status').eq('partner_id', user.id)
  ]);

  const totalClients = clientsResult.count || 0;
  const totalVehicles = vehiclesResult.count || 0;
  
  const parts = partsResult.data || [];
  const totalParts = parts.length;
  const lowStockParts = parts.filter(p => (p.current_stock || 0) <= (p.min_stock || 0)).length;

  const transactions = transactionsResult.data || [];
  const totalRevenue = transactions
    .filter(t => t.type === 'receita' && t.status === 'pago')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'despesa' && t.status === 'pago')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const monthlyRevenue = totalRevenue - totalExpenses;

  const appointments = appointmentsResult.data || [];
  const totalAppointments = appointments.length;
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmado' || a.status === 'concluido').length;
  const pendingAppointments = appointments.filter(a => a.status === 'agendado' || a.status === 'pendente').length;

  const serviceOrders = serviceOrdersResult.data || [];
  const totalServiceOrders = serviceOrders.length;
  const inProgressOrders = serviceOrders.filter(o => o.status === 'em_andamento' || o.status === 'aguardando_pecas').length;
  const completedServiceOrders = serviceOrders.filter(o => o.status === 'concluido' || o.status === 'entregue').length;

  const completionRate = totalServiceOrders > 0 ? (completedServiceOrders / totalServiceOrders) * 100 : 0;
  const appointmentRate = totalAppointments > 0 ? (confirmedAppointments / totalAppointments) * 100 : 0;
  const profitMargin = totalRevenue > 0 ? (monthlyRevenue / totalRevenue) * 100 : 0;

  return {
    totalClients,
    totalVehicles,
    totalParts,
    lowStockParts,
    totalRevenue,
    totalExpenses,
    monthlyRevenue,
    totalAppointments,
    confirmedAppointments,
    pendingAppointments,
    totalServiceOrders,
    inProgressOrders,
    completedServiceOrders,
    completionRate,
    appointmentRate,
    profitMargin
  };
}

function getDefaultMetrics(): DashboardMetrics {
  return {
    totalClients: 0,
    totalVehicles: 0,
    totalParts: 0,
    lowStockParts: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    monthlyRevenue: 0,
    totalAppointments: 0,
    confirmedAppointments: 0,
    pendingAppointments: 0,
    totalServiceOrders: 0,
    inProgressOrders: 0,
    completedServiceOrders: 0,
    completionRate: 0,
    appointmentRate: 0,
    profitMargin: 0
  };
}

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: fetchDashboardMetrics,
    staleTime: 2 * 60 * 1000, // 2 minutes for dashboard
    gcTime: 5 * 60 * 1000,
  });
}

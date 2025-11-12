import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardMetrics {
  totalClients: number;
  totalVehicles: number;
  totalServiceOrders: number;
  totalAppointments: number;
  totalRevenue: number;
  pendingServiceOrders: number;
  completedServiceOrders: number;
  cancelledAppointments: number;
  confirmedAppointments: number;
  lowStockParts: number;
  totalParts: number;
}

export const useMetrics = () => {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const partnerId = (await supabase.auth.getUser()).data.user?.id;
      if (!partnerId) {
        throw new Error('User not authenticated');
      }

      // Fetch all metrics in parallel
      const [
        clientsCount,
        vehiclesCount,
        serviceOrdersCount,
        appointmentsCount,
        revenueData,
        pendingOrders,
        completedOrders,
        cancelledAppts,
        confirmedAppts,
        lowStockParts,
        totalPartsCount
      ] = await Promise.all([
        // Total clients
        supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('partner_id', partnerId),
        
        // Total vehicles
        supabase
          .from('vehicles')
          .select('*', { count: 'exact', head: true })
          .eq('partner_id', partnerId),
        
        // Total service orders
        supabase
          .from('service_orders')
          .select('*', { count: 'exact', head: true })
          .eq('partner_id', partnerId),
        
        // Total appointments
        supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('partner_id', partnerId),
        
        // Revenue data
        supabase
          .from('financial_transactions')
          .select('amount')
          .eq('partner_id', partnerId)
          .eq('type', 'revenue'),
        
        // Pending service orders
        supabase
          .from('service_orders')
          .select('*', { count: 'exact', head: true })
          .eq('partner_id', partnerId)
          .eq('status', 'pending'),
        
        // Completed service orders
        supabase
          .from('service_orders')
          .select('*', { count: 'exact', head: true })
          .eq('partner_id', partnerId)
          .eq('status', 'completed'),
        
        // Cancelled appointments
        supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('partner_id', partnerId)
          .eq('status', 'cancelled'),
        
        // Confirmed appointments
        supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('partner_id', partnerId)
          .eq('status', 'confirmed'),
        
        // Low stock parts
        supabase
          .from('parts')
          .select('*', { count: 'exact', head: true })
          .eq('partner_id', partnerId)
          .lte('current_stock', 'minimum_stock'),
        
        // Total parts
        supabase
          .from('parts')
          .select('*', { count: 'exact', head: true })
          .eq('partner_id', partnerId)
      ]);

      // Calculate total revenue
      const totalRevenue = revenueData.data?.reduce((sum, transaction) => sum + (transaction.amount || 0), 0) || 0;

      return {
        totalClients: clientsCount.count || 0,
        totalVehicles: vehiclesCount.count || 0,
        totalServiceOrders: serviceOrdersCount.count || 0,
        totalAppointments: appointmentsCount.count || 0,
        totalRevenue,
        pendingServiceOrders: pendingOrders.count || 0,
        completedServiceOrders: completedOrders.count || 0,
        cancelledAppointments: cancelledAppts.count || 0,
        confirmedAppointments: confirmedAppts.count || 0,
        lowStockParts: lowStockParts.count || 0,
        totalParts: totalPartsCount.count || 0
      } as DashboardMetrics;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};
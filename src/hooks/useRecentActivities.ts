import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RecentActivity {
  id: string;
  type: 'client_created' | 'service_order_created' | 'appointment_created' | 'vehicle_added' | 'payment_received';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export const useRecentActivities = (limit: number = 5) => {
  return useQuery({
    queryKey: ['recent-activities', limit],
    queryFn: async () => {
      const partnerId = (await supabase.auth.getUser()).data.user?.id;
      if (!partnerId) {
        throw new Error('User not authenticated');
      }

      // Get recent data from multiple tables
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [
        recentClients,
        recentServiceOrders,
        recentAppointments,
        recentVehicles,
        recentPayments
      ] = await Promise.all([
        // Recent clients
        supabase
          .from('clients')
          .select('id, name, created_at')
          .eq('partner_id', partnerId)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(limit),
        
        // Recent service orders
        supabase
          .from('service_orders')
          .select('id, order_number, status, total_value, created_at')
          .eq('partner_id', partnerId)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(limit),
        
        // Recent appointments
        supabase
          .from('appointments')
          .select('id, title, status, scheduled_date, created_at')
          .eq('partner_id', partnerId)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(limit),
        
        // Recent vehicles
        supabase
          .from('vehicles')
          .select('id, brand, model, license_plate, created_at')
          .eq('partner_id', partnerId)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(limit),
        
        // Recent payments
        supabase
          .from('financial_transactions')
          .select('id, description, amount, type, created_at')
          .eq('partner_id', partnerId)
          .eq('type', 'revenue')
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(limit)
      ]);

      // Convert to activities
      const activities: RecentActivity[] = [];

      // Add client activities
      recentClients.data?.forEach(client => {
        activities.push({
          id: `client-${client.id}`,
          type: 'client_created',
          title: 'Novo Cliente',
          description: `Cliente ${client.name} foi adicionado`,
          timestamp: client.created_at,
          metadata: { clientId: client.id, clientName: client.name }
        });
      });

      // Add service order activities
      recentServiceOrders.data?.forEach(order => {
        activities.push({
          id: `order-${order.id}`,
          type: 'service_order_created',
          title: 'Nova Ordem de Serviço',
          description: `OS #${order.order_number} foi criada (${order.status})`,
          timestamp: order.created_at,
          metadata: { 
            orderId: order.id, 
            orderNumber: order.order_number, 
            status: order.status,
            totalValue: order.total_value 
          }
        });
      });

      // Add appointment activities
      recentAppointments.data?.forEach(appointment => {
        activities.push({
          id: `appointment-${appointment.id}`,
          type: 'appointment_created',
          title: 'Novo Agendamento',
          description: `${appointment.title} - ${appointment.status}`,
          timestamp: appointment.created_at,
          metadata: { 
            appointmentId: appointment.id, 
            title: appointment.title, 
            status: appointment.status,
            scheduledDate: appointment.scheduled_date 
          }
        });
      });

      // Add vehicle activities
      recentVehicles.data?.forEach(vehicle => {
        activities.push({
          id: `vehicle-${vehicle.id}`,
          type: 'vehicle_added',
          title: 'Novo Veículo',
          description: `${vehicle.brand} ${vehicle.model} - ${vehicle.license_plate}`,
          timestamp: vehicle.created_at,
          metadata: { 
            vehicleId: vehicle.id, 
            brand: vehicle.brand, 
            model: vehicle.model,
            licensePlate: vehicle.license_plate 
          }
        });
      });

      // Add payment activities
      recentPayments.data?.forEach(payment => {
        activities.push({
          id: `payment-${payment.id}`,
          type: 'payment_received',
          title: 'Pagamento Recebido',
          description: `${payment.description} - R$ ${payment.amount?.toFixed(2)}`,
          timestamp: payment.created_at,
          metadata: { 
            transactionId: payment.id, 
            description: payment.description, 
            amount: payment.amount 
          }
        });
      });

      // Sort by timestamp and limit
      activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return activities.slice(0, limit);
    },
    staleTime: 60 * 1000, // 1 minute
    retry: 2
  });
};
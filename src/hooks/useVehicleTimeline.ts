import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface VehicleTimelineEvent {
  id: string;
  type: 'service' | 'maintenance' | 'repair' | 'inspection' | 'document';
  title: string;
  description: string;
  date: Date;
  value?: number;
  mileage?: number;
  status?: string;
}

export const useVehicleTimeline = (vehicleId: string) => {
  const [events, setEvents] = useState<VehicleTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          throw new Error('Usuário não autenticado');
        }

        const timelineEvents: VehicleTimelineEvent[] = [];

        // Buscar ordens de serviço do veículo
        const { data: serviceOrders } = await supabase
          .from('service_orders')
          .select('id, order_number, created_at, status, total_amount, description, service_type')
          .eq('vehicle_id', vehicleId)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (serviceOrders) {
          serviceOrders.forEach(order => {
            // Determinar tipo baseado no service_type ou descrição
            let type: VehicleTimelineEvent['type'] = 'service';
            if (order.service_type?.toLowerCase().includes('manutenção') || 
                order.service_type?.toLowerCase().includes('revisão')) {
              type = 'maintenance';
            } else if (order.service_type?.toLowerCase().includes('reparo')) {
              type = 'repair';
            } else if (order.service_type?.toLowerCase().includes('inspeção')) {
              type = 'inspection';
            }

            timelineEvents.push({
              id: `service-${order.id}`,
              type,
              title: order.service_type || `OS ${order.order_number}`,
              description: order.description || `Ordem de serviço ${order.status}`,
              date: new Date(order.created_at),
              value: order.total_amount,
              status: order.status
            });
          });
        }

        // Buscar agendamentos do veículo para incluir no histórico
        const { data: appointments } = await supabase
          .from('appointments')
          .select('id, scheduled_date, status, notes, service_type')
          .eq('vehicle_id', vehicleId)
          .eq('user_id', session.user.id)
          .order('scheduled_date', { ascending: false })
          .limit(10);

        if (appointments) {
          appointments.forEach(apt => {
            timelineEvents.push({
              id: `appointment-${apt.id}`,
              type: 'service',
              title: apt.service_type || 'Agendamento',
              description: apt.notes || 'Serviço agendado',
              date: new Date(apt.scheduled_date),
              status: apt.status
            });
          });
        }

        // Ordenar eventos por data (mais recente primeiro)
        timelineEvents.sort((a, b) => b.date.getTime() - a.date.getTime());

        setEvents(timelineEvents);
      } catch (err: any) {
        console.error('Erro ao buscar timeline do veículo:', err);
        setError(err.message || 'Erro ao carregar timeline');
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchTimeline();
    }
  }, [vehicleId]);

  return { events, loading, error };
};

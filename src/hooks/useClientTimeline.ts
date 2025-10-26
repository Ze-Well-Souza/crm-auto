import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ClientTimelineEvent {
  id: string;
  type: 'service' | 'appointment' | 'contact' | 'payment' | 'note';
  title: string;
  description: string;
  date: Date;
  value?: number;
  status?: string;
}

export const useClientTimeline = (clientId: string) => {
  const [events, setEvents] = useState<ClientTimelineEvent[]>([]);
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

        const timelineEvents: ClientTimelineEvent[] = [];

        // Buscar ordens de serviço
        const { data: serviceOrders } = await supabase
          .from('service_orders')
          .select('id, order_number, created_at, status, total_amount')
          .eq('client_id', clientId)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (serviceOrders) {
          serviceOrders.forEach(order => {
            timelineEvents.push({
              id: `service-${order.id}`,
              type: 'service',
              title: `OS ${order.order_number} ${order.status === 'finalizado' ? 'concluída' : 'criada'}`,
              description: `Ordem de serviço ${order.status === 'finalizado' ? 'finalizada' : 'registrada'}`,
              date: new Date(order.created_at),
              value: order.total_amount,
              status: order.status
            });
          });
        }

        // Buscar agendamentos
        const { data: appointments } = await supabase
          .from('appointments')
          .select('id, scheduled_date, status, notes')
          .eq('client_id', clientId)
          .eq('user_id', session.user.id)
          .order('scheduled_date', { ascending: false })
          .limit(10);

        if (appointments) {
          appointments.forEach(apt => {
            timelineEvents.push({
              id: `appointment-${apt.id}`,
              type: 'appointment',
              title: 'Agendamento criado',
              description: apt.notes || 'Novo agendamento registrado',
              date: new Date(apt.scheduled_date),
              status: apt.status
            });
          });
        }

        // Buscar transações financeiras
        const { data: transactions } = await supabase
          .from('financial_transactions')
          .select('id, created_at, amount, status, type, description')
          .eq('client_id', clientId)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (transactions) {
          transactions.forEach(trans => {
            timelineEvents.push({
              id: `payment-${trans.id}`,
              type: 'payment',
              title: trans.status === 'pago' ? 'Pagamento recebido' : 'Pagamento pendente',
              description: trans.description || `Transação ${trans.type}`,
              date: new Date(trans.created_at),
              value: trans.amount,
              status: trans.status
            });
          });
        }

        // Ordenar eventos por data (mais recente primeiro)
        timelineEvents.sort((a, b) => b.date.getTime() - a.date.getTime());

        setEvents(timelineEvents);
      } catch (err: any) {
        console.error('Erro ao buscar timeline do cliente:', err);
        setError(err.message || 'Erro ao carregar timeline');
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchTimeline();
    }
  }, [clientId]);

  return { events, loading, error };
};

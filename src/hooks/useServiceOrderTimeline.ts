import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ServiceOrderTimelineEvent {
  id: string;
  type: 'status_change' | 'payment' | 'communication' | 'note' | 'part_added' | 'labor_added';
  title: string;
  description: string;
  date: Date;
  value?: number;
  status?: string;
  user?: string;
}

export const useServiceOrderTimeline = (serviceOrderId: string) => {
  const [events, setEvents] = useState<ServiceOrderTimelineEvent[]>([]);
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

        const timelineEvents: ServiceOrderTimelineEvent[] = [];

        // Buscar ordem de serviço
        const { data: serviceOrder } = await supabase
          .from('crm_service_orders')
          .select('*')
          .eq('id', serviceOrderId)
          .eq('user_id', session.user.id)
          .single();

        if (serviceOrder) {
          // Evento de criação
          timelineEvents.push({
            id: `created-${serviceOrder.id}`,
            type: 'status_change',
            title: 'Ordem criada',
            description: `Ordem de serviço ${serviceOrder.order_number} criada`,
            date: new Date(serviceOrder.created_at),
            status: serviceOrder.status,
            user: 'Sistema'
          });

          // Se foi atualizada, adicionar evento de status
          if (serviceOrder.updated_at !== serviceOrder.created_at) {
            timelineEvents.push({
              id: `updated-${serviceOrder.id}`,
              type: 'status_change',
              title: `Status: ${serviceOrder.status}`,
              description: `Ordem de serviço atualizada para ${serviceOrder.status}`,
              date: new Date(serviceOrder.updated_at),
              status: serviceOrder.status,
              user: 'Sistema'
            });
          }
        }

        // Buscar itens da ordem (peças e serviços)
        const { data: items } = await supabase
          .from('crm_service_order_items')
          .select('*')
          .eq('service_order_id', serviceOrderId)
          .order('created_at', { ascending: true });

        if (items) {
          items.forEach(item => {
            const type = item.type === 'part' ? 'part_added' : 'labor_added';
            const title = item.type === 'part' ? 'Peça adicionada' : 'Mão de obra registrada';
            
            timelineEvents.push({
              id: `item-${item.id}`,
              type,
              title,
              description: `${item.description} - ${item.quantity}x`,
              date: new Date(item.created_at),
              value: item.total_price,
              user: 'Sistema'
            });
          });
        }

        // Buscar transações financeiras relacionadas
        const { data: transactions } = await supabase
          .from('crm_financial_transactions')
          .select('*')
          .eq('service_order_id', serviceOrderId)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: true });

        if (transactions) {
          transactions.forEach(trans => {
            timelineEvents.push({
              id: `payment-${trans.id}`,
              type: 'payment',
              title: trans.status === 'pago' ? 'Pagamento recebido' : 'Pagamento registrado',
              description: trans.description || `Transação ${trans.type}`,
              date: new Date(trans.created_at),
              value: trans.amount,
              status: trans.status,
              user: 'Sistema'
            });
          });
        }

        // Ordenar eventos por data (cronológica)
        timelineEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

        setEvents(timelineEvents);
      } catch (err: any) {
        console.error('Erro ao buscar timeline da ordem:', err);
        setError(err.message || 'Erro ao carregar timeline');
      } finally {
        setLoading(false);
      }
    };

    if (serviceOrderId) {
      fetchTimeline();
    }
  }, [serviceOrderId]);

  return { events, loading, error };
};

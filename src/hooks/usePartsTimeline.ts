import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PartsTimelineEvent {
  id: string;
  type: 'stock_in' | 'stock_out' | 'price_change' | 'reorder' | 'adjustment' | 'sale' | 'return';
  title: string;
  description: string;
  date: Date;
  quantity?: number;
  value?: number;
  user?: string;
  reference?: string;
}

export const usePartsTimeline = (partId: string) => {
  const [events, setEvents] = useState<PartsTimelineEvent[]>([]);
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

        const timelineEvents: PartsTimelineEvent[] = [];

        // Buscar movimentações de estoque
        const { data: movements } = await supabase
          .from('crm_stock_movements')
          .select('*')
          .eq('part_id', partId)
          .order('created_at', { ascending: false })
          .limit(30);

        if (movements) {
          movements.forEach(mov => {
            let type: PartsTimelineEvent['type'] = 'adjustment';
            let title = 'Ajuste de estoque';
            
            if (mov.movement_type === 'entrada') {
              type = 'stock_in';
              title = 'Entrada de estoque';
            } else if (mov.movement_type === 'saida') {
              type = 'stock_out';
              title = 'Saída de estoque';
            }

            // Se tem referência de ordem de serviço, é venda
            if (mov.reference_type === 'service_order' && mov.movement_type === 'saida') {
              type = 'sale';
              title = 'Venda realizada';
            }

            timelineEvents.push({
              id: `movement-${mov.id}`,
              type,
              title,
              description: mov.notes || 'Movimentação de estoque',
              date: new Date(mov.created_at),
              quantity: mov.movement_type === 'entrada' ? mov.quantity : -mov.quantity,
              reference: mov.reference_id?.toString(),
              user: mov.created_by || 'Sistema'
            });
          });
        }

        // Buscar itens de ordem de serviço (vendas)
        const { data: serviceItems } = await supabase
          .from('crm_service_order_items')
          .select(`
            id,
            created_at,
            quantity,
            total_price,
            description,
            service_orders (order_number)
          `)
          .eq('part_id', partId)
          .order('created_at', { ascending: false })
          .limit(20);

        if (serviceItems) {
          serviceItems.forEach(item => {
            const orderNumber = (item as any).service_orders?.order_number;
            
            timelineEvents.push({
              id: `sale-${item.id}`,
              type: 'sale',
              title: 'Peça vendida',
              description: item.description || 'Venda em ordem de serviço',
              date: new Date(item.created_at),
              quantity: -item.quantity,
              value: item.total_price,
              reference: orderNumber,
              user: 'Sistema'
            });
          });
        }

        // Ordenar eventos por data (mais recente primeiro)
        timelineEvents.sort((a, b) => b.date.getTime() - a.date.getTime());

        setEvents(timelineEvents);
      } catch (err: any) {
        console.error('Erro ao buscar timeline da peça:', err);
        setError(err.message || 'Erro ao carregar timeline');
      } finally {
        setLoading(false);
      }
    };

    if (partId) {
      fetchTimeline();
    }
  }, [partId]);

  return { events, loading, error };
};

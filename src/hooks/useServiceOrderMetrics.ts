import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ServiceOrderMetrics {
  profitMargin: number;
  timeSpent: number | null; // em minutos
  estimatedTime: number | null; // em minutos
  approvalTime: number | null; // em horas
  complexity: 'baixa' | 'media' | 'alta';
  itemsCount: number;
  partsValue: number;
  laborValue: number;
}

export const useServiceOrderMetrics = (serviceOrderId: string) => {
  const [metrics, setMetrics] = useState<ServiceOrderMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          throw new Error('Usuário não autenticado');
        }

        // Buscar ordem de serviço completa
        const { data: order, error: orderError } = await supabase
          .from('crm_service_orders')
          .select('*')
          .eq('id', serviceOrderId)
          .eq('partner_id', session.user.id)
          .single();

        if (orderError) throw orderError;

        // Buscar itens da ordem (se existir tabela service_order_items)
        const { data: items } = await supabase
          .from('crm_service_order_items')
          .select('*')
          .eq('service_order_id', serviceOrderId);

        // Calcular métricas
        const totalAmount = Number(order.total_amount || 0);
        const totalParts = Number(order.total_parts || 0);
        const totalLabor = Number(order.total_labor || 0);
        const discount = Number(order.discount || 0);

        // Margem de lucro: assumindo custo de peças = 60% do valor
        const partsCost = totalParts * 0.6;
        const totalCost = partsCost; // Pode adicionar outros custos
        const profit = totalAmount - totalCost - discount;
        const profitMargin = totalAmount > 0 ? (profit / totalAmount) * 100 : 0;

        // Tempo gasto (se ordem finalizada)
        let timeSpent: number | null = null;
        if (order.status === 'finalizado' && order.updated_at && order.created_at) {
          const start = new Date(order.created_at).getTime();
          const end = new Date(order.updated_at).getTime();
          timeSpent = Math.floor((end - start) / (1000 * 60)); // minutos
        }

        // Tempo estimado (baseado em quantidade de itens)
        const itemsCount = items?.length || 1;
        const estimatedTime = itemsCount * 60; // 1 hora por item em média

        // Tempo de aprovação (se mudou de orçamento para aprovado)
        let approvalTime: number | null = null;
        if (order.status !== 'orcamento' && order.updated_at && order.created_at) {
          const start = new Date(order.created_at).getTime();
          const approval = new Date(order.updated_at).getTime();
          approvalTime = Math.floor((approval - start) / (1000 * 60 * 60)); // horas
        }

        // Complexidade baseada em valor e quantidade de itens
        let complexity: 'baixa' | 'media' | 'alta';
        if (totalAmount > 2000 || itemsCount > 5) {
          complexity = 'alta';
        } else if (totalAmount > 500 || itemsCount > 2) {
          complexity = 'media';
        } else {
          complexity = 'baixa';
        }

        setMetrics({
          profitMargin: Math.round(profitMargin * 10) / 10,
          timeSpent,
          estimatedTime,
          approvalTime,
          complexity,
          itemsCount,
          partsValue: totalParts,
          laborValue: totalLabor
        });
      } catch (err: any) {
        console.error('Erro ao buscar métricas da ordem:', err);
        setError(err.message || 'Erro ao carregar métricas');
      } finally {
        setLoading(false);
      }
    };

    if (serviceOrderId) {
      fetchMetrics();
    }
  }, [serviceOrderId]);

  return { metrics, loading, error };
};

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ClientMetrics {
  totalSpent: number;
  serviceCount: number;
  vehicleCount: number;
  lastService: Date | null;
  score: number;
  pendingAmount: number;
  averageTicket: number;
}

export const useClientMetrics = (clientId: string) => {
  const [metrics, setMetrics] = useState<ClientMetrics | null>(null);
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

        // Buscar transações financeiras do cliente
        const { data: transactions, error: transError } = await supabase
          .from('financial_transactions')
          .select('amount, status')
          .eq('client_id', clientId)
          .eq('user_id', session.user.id);

        if (transError) throw transError;

        // Buscar ordens de serviço do cliente
        const { data: serviceOrders, error: ordersError } = await supabase
          .from('service_orders')
          .select('id, created_at, total_amount')
          .eq('client_id', clientId)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        // Buscar veículos do cliente
        const { data: vehicles, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('id')
          .eq('client_id', clientId)
          .eq('user_id', session.user.id);

        if (vehiclesError) throw vehiclesError;

        // Calcular métricas
        const totalSpent = transactions
          ?.filter(t => t.status === 'pago')
          .reduce((sum, t) => sum + Number(t.amount || 0), 0) || 0;

        const pendingAmount = transactions
          ?.filter(t => t.status === 'pendente')
          .reduce((sum, t) => sum + Number(t.amount || 0), 0) || 0;

        const serviceCount = serviceOrders?.length || 0;
        const vehicleCount = vehicles?.length || 0;
        
        const lastService = serviceOrders && serviceOrders.length > 0
          ? new Date(serviceOrders[0].created_at)
          : null;

        const averageTicket = serviceCount > 0 ? totalSpent / serviceCount : 0;

        // Calcular score baseado em dados reais
        // Score de 0-100 baseado em:
        // - Total gasto (40%)
        // - Quantidade de serviços (30%)
        // - Recência do último serviço (20%)
        // - Quantidade de veículos (10%)
        let score = 0;
        
        // Total gasto (máximo 40 pontos - R$ 10.000+ = 40 pontos)
        score += Math.min(40, (totalSpent / 10000) * 40);
        
        // Quantidade de serviços (máximo 30 pontos - 10+ serviços = 30 pontos)
        score += Math.min(30, (serviceCount / 10) * 30);
        
        // Recência (máximo 20 pontos - último serviço há menos de 30 dias = 20 pontos)
        if (lastService) {
          const daysSinceLastService = Math.floor(
            (Date.now() - lastService.getTime()) / (1000 * 60 * 60 * 24)
          );
          score += Math.max(0, 20 - (daysSinceLastService / 30) * 20);
        }
        
        // Quantidade de veículos (máximo 10 pontos - 3+ veículos = 10 pontos)
        score += Math.min(10, (vehicleCount / 3) * 10);

        setMetrics({
          totalSpent,
          serviceCount,
          vehicleCount,
          lastService,
          score: Math.round(score),
          pendingAmount,
          averageTicket
        });
      } catch (err: any) {
        console.error('Erro ao buscar métricas do cliente:', err);
        setError(err.message || 'Erro ao carregar métricas');
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchMetrics();
    }
  }, [clientId]);

  return { metrics, loading, error };
};

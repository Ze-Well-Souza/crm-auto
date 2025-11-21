import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ClientMetrics } from "@/types";

export const useClientMetricsAdvanced = () => {
  const [metrics, setMetrics] = useState<ClientMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        // Dados mock para demo
        setMetrics({
          totalClients: 6,
          averageQualityScore: 75,
          vipCount: 2,
          newCount: 1,
          regularCount: 3,
          withEmail: 6,
          recentClients: 2
        });
        setLoading(false);
        return;
      }

      // Buscar todos os clientes do parceiro
      const { data: clients, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .eq('partner_id', session.user.id);

      if (fetchError) throw fetchError;

      if (!clients || clients.length === 0) {
        setMetrics({
          totalClients: 0,
          averageQualityScore: 0,
          vipCount: 0,
          newCount: 0,
          regularCount: 0,
          withEmail: 0,
          recentClients: 0
        });
        setLoading(false);
        return;
      }

      // Calcular métricas
      const totalClients = clients.length;
      
      // Média de qualidade
      const totalQuality = clients.reduce((sum, client) => sum + (client.quality_score || 0), 0);
      const averageQualityScore = Math.round(totalQuality / totalClients);
      
      // Contar VIPs
      const vipCount = clients.filter(c => c.is_vip).length;
      
      // Contar novos (sem serviços ou criados nos últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const newCount = clients.filter(c => 
        c.service_count === 0 || new Date(c.created_at) > thirtyDaysAgo
      ).length;
      
      // Contar regulares (não VIP e não novos)
      const regularCount = totalClients - vipCount - newCount;
      
      // Contar com email
      const withEmail = clients.filter(c => c.email && c.email.trim() !== '').length;
      
      // Contar recentes (criados nos últimos 7 dias)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentClients = clients.filter(c => new Date(c.created_at) > sevenDaysAgo).length;

      setMetrics({
        totalClients,
        averageQualityScore,
        vipCount,
        newCount,
        regularCount,
        withEmail,
        recentClients
      });
    } catch (err: any) {
      console.error('Erro ao buscar métricas de clientes:', err);
      setError(err.message);
      // Fallback para dados mock
      setMetrics({
        totalClients: 0,
        averageQualityScore: 0,
        vipCount: 0,
        newCount: 0,
        regularCount: 0,
        withEmail: 0,
        recentClients: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics
  };
};


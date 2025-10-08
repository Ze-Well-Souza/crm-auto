import { Store, TrendingUp, Users, Star } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { usePartners } from '@/hooks/usePartners';

export const PartnerMetrics = () => {
  const { partners } = usePartners();

  const activePartners = partners.filter(p => p.status === 'ativo').length;
  const totalRevenue = partners.reduce((sum, p) => sum + (p.total_revenue || 0), 0);
  const totalOrders = partners.reduce((sum, p) => sum + (p.orders_count || 0), 0);
  const avgRating = partners.length > 0
    ? partners.reduce((sum, p) => sum + (p.rating || 0), 0) / partners.filter(p => p.rating).length
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Parceiros Ativos"
        value={activePartners}
        icon={Store}
        trend="neutral"
        color="success"
      />
      <MetricCard
        title="Total Pedidos"
        value={totalOrders}
        icon={Users}
        trend="neutral"
        color="info"
      />
      <MetricCard
        title="Faturamento Total"
        value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        icon={TrendingUp}
        trend="neutral"
        color="success"
      />
      <MetricCard
        title="Avaliação Média"
        value={avgRating > 0 ? avgRating.toFixed(1) : '0.0'}
        icon={Star}
        trend="neutral"
        color="warning"
      />
    </div>
  );
};

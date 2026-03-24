import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ModuleErrorBoundary } from '@/components/ErrorBoundary/ModuleErrorBoundary';
import { PartnerDashboard } from '@/components/partners/PartnerDashboard';
import { OrdersDashboard } from '@/components/marketplace-orders/OrdersDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { usePartners } from '@/hooks/usePartners';
import {
  Store,
  ShoppingBag,
  TrendingUp,
  Users,
  Star,
  ExternalLink,
  Zap,
} from 'lucide-react';

const Parceiros = () => {
  const { partners } = usePartners();

  const activePartners = partners.filter((p) => p.status === 'ativo').length;
  const pendingPartners = partners.filter((p) => p.status === 'pendente').length;
  const totalRevenue = partners.reduce((sum, p) => sum + (p.total_revenue || 0), 0);
  const totalOrders = partners.reduce((sum, p) => sum + (p.orders_count || 0), 0);
  const avgRating =
    partners.filter((p) => p.rating).length > 0
      ? partners.reduce((sum, p) => sum + (p.rating || 0), 0) /
        partners.filter((p) => p.rating).length
      : 0;

  const metrics = [
    {
      icon: Store,
      label: 'Parceiros Ativos',
      value: activePartners,
      sub: pendingPartners > 0 ? `${pendingPartners} pendentes` : 'todos aprovados',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: ShoppingBag,
      label: 'Pedidos Recebidos',
      value: totalOrders,
      sub: 'do marketplace',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Faturamento',
      value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      sub: 'receita via parceiros',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      icon: Star,
      label: 'Avaliação Média',
      value: avgRating > 0 ? avgRating.toFixed(1) : '–',
      sub: avgRating > 0 ? 'estrelas dos clientes' : 'sem avaliações ainda',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <DashboardLayout>
      <ModuleErrorBoundary moduleName="Parceiros" fallbackRoute="/">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">Gestão de Parceiros</h1>
                  <Badge
                    variant="secondary"
                    className="text-xs gap-1 bg-blue-500/10 text-blue-500"
                  >
                    <Zap className="h-3 w-3" />
                    Marketplace
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Gerencie seus parceiros do{' '}
                  <a
                    href="https://uautos.com.br"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-500 hover:underline font-medium"
                  >
                    uautos.com.br
                    <ExternalLink className="h-3 w-3" />
                  </a>{' '}
                  e receba pedidos automaticamente
                </p>
              </div>
            </div>

            {/* Badge de integração */}
            {partners.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Marketplace conectado
              </div>
            )}
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <Card key={m.label} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${m.bg}`}>
                      <m.icon className={`h-4 w-4 ${m.color}`} />
                    </div>
                    <span className="text-xs text-muted-foreground">{m.label}</span>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.sub}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="parceiros" className="space-y-6">
            <TabsList className="bg-muted/60 border">
              <TabsTrigger value="parceiros" className="gap-2">
                <Store className="h-4 w-4" />
                Parceiros
                {activePartners > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {activePartners}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="pedidos" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Pedidos do Marketplace
                {totalOrders > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {totalOrders}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="parceiros" className="space-y-6">
              <PartnerDashboard />
            </TabsContent>

            <TabsContent value="pedidos" className="space-y-6">
              <OrdersDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </ModuleErrorBoundary>
    </DashboardLayout>
  );
};

export default Parceiros;

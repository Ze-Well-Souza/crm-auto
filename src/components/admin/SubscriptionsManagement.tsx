import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Calendar, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface SubscriptionStats {
  total: number;
  active: number;
  trial: number;
  cancelled: number;
}

interface UserSubscriptionUsage {
  email: string;
  plan_name: string;
  status: string;
  clients_current: number;
  clients_limit: number | null;
  appointments_current: number;
  appointments_limit: number | null;
  reports_current: number;
  reports_limit: number | null;
}

export const SubscriptionsManagement = () => {
  const [stats, setStats] = useState<SubscriptionStats>({
    total: 0,
    active: 0,
    trial: 0,
    cancelled: 0,
  });
  const [usageData, setUsageData] = useState<UserSubscriptionUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Carregar estatísticas
      const { data: subscriptions } = await supabase
        .from('partner_subscriptions')
        .select('status');

      if (subscriptions) {
        setStats({
          total: subscriptions.length,
          active: subscriptions.filter(s => s.status === 'active').length,
          trial: subscriptions.filter(s => s.status === 'trial').length,
          cancelled: subscriptions.filter(s => s.status === 'cancelled').length,
        });
      }

      // Carregar uso detalhado
      const { data: usageDetails } = await supabase
        .from('partner_subscriptions')
        .select(`
          partner_id,
          status,
          current_clients_count,
          current_appointments_count,
          current_reports_count,
          plan:subscription_plans(
            name,
            max_active_clients,
            max_appointments_per_month,
            max_reports_per_month
          )
        `)
        .in('status', ['active', 'trial']);

      if (usageDetails) {
        // Buscar emails dos usuários
        const usageWithEmails = await Promise.all(
          usageDetails.map(async (sub: any) => {
            const { data: { user } } = await supabase.auth.admin.getUserById(sub.partner_id);
            
            return {
              email: user?.email || 'Sem email',
              plan_name: sub.plan?.name || 'Sem plano',
              status: sub.status,
              clients_current: sub.current_clients_count,
              clients_limit: sub.plan?.max_active_clients,
              appointments_current: sub.current_appointments_count,
              appointments_limit: sub.plan?.max_appointments_per_month,
              reports_current: sub.current_reports_count,
              reports_limit: sub.plan?.max_reports_per_month,
            };
          })
        );

        setUsageData(usageWithEmails);
      }
    } catch (err: any) {
      console.error('Error loading subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (current: number, limit: number | null) => {
    if (limit === null) return 0; // Ilimitado
    return Math.round((current / limit) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="text-3xl font-bold">{stats.total}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-green-600" />
              <div className="text-3xl font-bold">{stats.active}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Trial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="text-3xl font-bold">{stats.trial}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cancelados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-red-600" />
              <div className="text-3xl font-bold">{stats.cancelled}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Uso */}
      <Card>
        <CardHeader>
          <CardTitle>Uso por Usuário</CardTitle>
          <CardDescription>
            Monitoramento de uso de recursos por assinatura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Clientes</TableHead>
                  <TableHead>Agendamentos</TableHead>
                  <TableHead>Relatórios</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usageData.map((user, idx) => {
                  const clientsPerc = calculatePercentage(user.clients_current, user.clients_limit);
                  const appointmentsPerc = calculatePercentage(user.appointments_current, user.appointments_limit);
                  const reportsPerc = calculatePercentage(user.reports_current, user.reports_limit);

                  const hasHighUsage = clientsPerc >= 80 || appointmentsPerc >= 80 || reportsPerc >= 80;

                  return (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.plan_name}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={user.status === 'active' ? 'bg-green-600' : 'bg-blue-600'}>
                          {user.status === 'active' ? 'Ativo' : 'Trial'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {user.clients_current} / {user.clients_limit || '∞'}
                            </span>
                            {clientsPerc >= 80 && user.clients_limit && (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                          {user.clients_limit && (
                            <Progress value={clientsPerc} className="h-1.5" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {user.appointments_current} / {user.appointments_limit || '∞'}
                            </span>
                            {appointmentsPerc >= 80 && user.appointments_limit && (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                          {user.appointments_limit && (
                            <Progress value={appointmentsPerc} className="h-1.5" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {user.reports_current} / {user.reports_limit || '∞'}
                            </span>
                            {reportsPerc >= 80 && user.reports_limit && (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                          {user.reports_limit && (
                            <Progress value={reportsPerc} className="h-1.5" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {usageData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma assinatura ativa encontrada
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

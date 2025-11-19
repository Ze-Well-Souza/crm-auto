import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';
import { createPortalSession } from '@/lib/stripe-client';
import { Users, Calendar, FileText, Crown, ArrowUpRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const UsageDashboard = () => {
  const { subscription, plan, usage, isTrialActive, getTrialDaysRemaining } = useSubscriptionContext();
  const navigate = useNavigate();

  const handleManageSubscription = async () => {
    try {
      toast.info('Abrindo portal de gerenciamento...');
      const { url } = await createPortalSession();
      window.location.href = url;
    } catch (error: any) {
      toast.error('Erro ao abrir portal: ' + error.message);
    }
  };

  if (!subscription || !usage) {
    return <div>Carregando...</div>;
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const resources = [
    {
      name: 'Clientes',
      icon: Users,
      current: usage.clients.current,
      limit: usage.clients.limit,
      percentage: usage.clients.percentage,
    },
    {
      name: 'Agendamentos',
      icon: Calendar,
      current: usage.appointments.current,
      limit: usage.appointments.limit,
      percentage: usage.appointments.percentage,
    },
    {
      name: 'Relatórios',
      icon: FileText,
      current: usage.reports.current,
      limit: usage.reports.limit,
      percentage: usage.reports.percentage,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Card de Status do Plano */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Plano {plan?.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {subscription.status === 'trial' ? 'Trial ativo' : 'Assinatura ativa'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/planos')} size="sm">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Fazer Upgrade
              </Button>
              {subscription.status !== 'trial' && plan.name !== 'Gratuito' && (
                <Button onClick={handleManageSubscription} variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Gerenciar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isTrialActive() && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                🎉 Você tem {getTrialDaysRemaining()} dias restantes do trial gratuito
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Após o trial, será cobrado R$ {plan?.price}/mês
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cards de Uso */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((resource) => {
          const Icon = resource.icon;
          const isUnlimited = resource.limit === null;
          const isNearLimit = resource.percentage >= 80;
          
          return (
            <Card key={resource.name}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base">{resource.name}</CardTitle>
                  </div>
                  {isNearLimit && !isUnlimited && (
                    <Badge variant="destructive">Limite próximo</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold">{resource.current}</span>
                    <span className="text-sm text-muted-foreground">
                      {isUnlimited ? 'Ilimitado' : `de ${resource.limit}`}
                    </span>
                  </div>
                  
                  {!isUnlimited && (
                    <>
                      <Progress 
                        value={resource.percentage} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {resource.percentage}% usado
                      </p>
                    </>
                  )}

                  {isUnlimited && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      ✓ Uso ilimitado neste plano
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerta de Limite */}
      {(usage.clients.percentage >= 80 ||
        usage.appointments.percentage >= 80 ||
        usage.reports.percentage >= 80) && (
        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-orange-900 dark:text-orange-100">Você está próximo do limite</h3>
                <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                  Faça upgrade para um plano superior e continue usando todos os recursos sem interrupções.
                </p>
                <Button onClick={() => navigate('/planos')}>
                  Ver Planos Disponíveis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

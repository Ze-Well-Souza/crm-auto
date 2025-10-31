import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';
import { createPortalSession } from '@/lib/stripe-client';
import { Crown, ExternalLink, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const SubscriptionManager = () => {
  const { subscription, plan, isTrialActive, getTrialDaysRemaining } = useSubscriptionContext();
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

  if (!subscription || !plan) {
    return <div>Carregando...</div>;
  }

  const getStatusInfo = () => {
    switch (subscription.status) {
      case 'active':
        return {
          icon: '🟢',
          label: 'Ativo',
          variant: 'bg-green-600' as const,
          description: 'Sua assinatura está ativa'
        };
      case 'trial':
        return {
          icon: '🔵',
          label: `Trial (${getTrialDaysRemaining()} dias restantes)`,
          variant: 'bg-blue-600' as const,
          description: 'Você está no período trial'
        };
      case 'cancelled':
        return {
          icon: '🟡',
          label: 'Cancelado',
          variant: 'bg-yellow-600' as const,
          description: `Ativo até ${new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}`
        };
      case 'expired':
        return {
          icon: '🔴',
          label: 'Expirado',
          variant: 'bg-red-600' as const,
          description: 'Sua assinatura expirou'
        };
      default:
        return {
          icon: '⚪',
          label: subscription.status,
          variant: 'bg-gray-600' as const,
          description: ''
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Gerenciar Assinatura</CardTitle>
              <CardDescription>Plano {plan.name}</CardDescription>
            </div>
          </div>
          <Badge className={statusInfo.variant}>
            {statusInfo.icon} {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status da Assinatura */}
        <div className="p-4 border rounded-lg bg-muted/50">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium mb-1">{statusInfo.description}</h4>
              {subscription.status !== 'expired' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Próxima cobrança: {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-3">
          {/* Upgrade */}
          {(subscription.status === 'trial' || plan.name === 'Gratuito' || plan.name === 'Básico') && (
            <Button onClick={() => navigate('/planos')} className="w-full" size="lg">
              <Crown className="h-4 w-4 mr-2" />
              Fazer Upgrade de Plano
            </Button>
          )}

          {/* Gerenciar no Stripe */}
          {subscription.status !== 'trial' && plan.name !== 'Gratuito' && (
            <Button 
              onClick={handleManageSubscription} 
              variant="outline" 
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Gerenciar no Stripe
            </Button>
          )}

          {/* Cancelar Assinatura */}
          {subscription.status === 'active' && subscription.cancel_at_period_end === false && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Cancelar Assinatura
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Sua assinatura será cancelada ao final do período atual (
                    {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
                    ). Você continuará tendo acesso até lá.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleManageSubscription}>
                    Confirmar Cancelamento
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Info sobre dados após cancelamento */}
        {subscription.status === 'cancelled' && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              ℹ️ Seus dados serão preservados, mas você não poderá adicionar novos registros que excedam o limite do plano gratuito.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

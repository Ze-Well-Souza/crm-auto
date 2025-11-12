import { toast } from 'sonner';
import * as Sentry from '@sentry/react';
import { supabase } from '@/integrations/supabase/client';

export const usePlanLimits = () => {
  // Validação server-side via Edge Function
  const validateLimit = async (
    actionType: 'clients' | 'appointments' | 'reports'
  ): Promise<{ canProceed: boolean; current: number; limit: string | number; percentage?: number; message?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('validate-plan-limit', {
        body: { action_type: actionType }
      });

      if (error) {
        console.error('Error validating limit:', error);
        Sentry.captureException(error, {
          tags: { component: 'usePlanLimits', action: 'validateLimit' },
          extra: { actionType }
        });
        return { canProceed: false, current: 0, limit: 0, message: 'Erro ao validar limite' };
      }

      return data;
    } catch (error) {
      console.error('Error in validateLimit:', error);
      return { canProceed: false, current: 0, limit: 0, message: 'Erro ao validar limite' };
    }
  };

  const checkLimit = async (
    actionType: 'clients' | 'appointments' | 'reports',
    actionName: string
  ): Promise<boolean> => {
    const result = await validateLimit(actionType);
    
    if (!result.canProceed) {
      toast.error('Limite atingido', {
        description: result.message || `Você atingiu o limite de ${actionName} do seu plano atual.`,
        action: {
          label: 'Ver Planos',
          onClick: () => window.location.href = '/planos',
        },
      });
      return false;
    }
    
    return true;
  };

  const checkAndIncrement = async (
    actionType: 'clients' | 'appointments' | 'reports',
    actionName: string
  ): Promise<boolean> => {
    // A validação server-side via RLS já garante que o limite não será ultrapassado
    // Este método agora apenas verifica e exibe mensagem ao usuário antes da tentativa
    const canProceed = await checkLimit(actionType, actionName);
    return canProceed;
  };

  const showLimitWarning = async (actionType: 'clients' | 'appointments' | 'reports') => {
    const result = await validateLimit(actionType);
    
    if (result.percentage && result.percentage >= 80 && result.percentage < 100) {
      toast.warning('Atenção ao limite', {
        description: `Você está usando ${result.percentage}% do seu limite de ${actionType}. Considere fazer upgrade.`,
      });
    }
  };

  const getLimitStatus = async (actionType: 'clients' | 'appointments' | 'reports') => {
    const result = await validateLimit(actionType);

    if (!result) {
      return { status: 'unknown', message: 'Carregando informações do plano...' };
    }

    if (result.limit === 'unlimited' || result.limit === null) {
      return { status: 'unlimited', message: 'Uso ilimitado' };
    }

    if (result.current >= Number(result.limit)) {
      return { status: 'exceeded', message: 'Limite atingido' };
    }

    if (result.percentage && result.percentage >= 80) {
      return { status: 'warning', message: `${result.current} de ${result.limit} (${result.percentage}%)` };
    }

    return { status: 'ok', message: `${result.current} de ${result.limit}` };
  };

  return {
    checkLimit,
    checkAndIncrement,
    showLimitWarning,
    getLimitStatus,
    validateLimit, // Expor para uso direto
  };
};

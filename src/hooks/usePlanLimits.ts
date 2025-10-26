import { useSubscription } from './useSubscription';
import { toast } from 'sonner';

export const usePlanLimits = () => {
  const { subscription, usage, canPerformAction, incrementUsage } = useSubscription();

  const checkLimit = (
    actionType: 'clients' | 'appointments' | 'reports',
    actionName: string
  ): boolean => {
    if (!canPerformAction(actionType)) {
      const resource = usage?.[actionType];
      
      toast.error(`Limite atingido`, {
        description: `Você atingiu o limite de ${resource?.limit} ${actionName}. Faça upgrade do seu plano para continuar.`,
        action: {
          label: 'Fazer Upgrade',
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
    if (!checkLimit(actionType, actionName)) {
      return false;
    }
    
    await incrementUsage(actionType);
    return true;
  };

  const showLimitWarning = (actionType: 'clients' | 'appointments' | 'reports') => {
    const resource = usage?.[actionType];
    
    if (!resource || resource.limit === null) return;
    
    if (resource.percentage >= 80 && resource.percentage < 100) {
      toast.warning('Atenção: Limite próximo', {
        description: `Você usou ${resource.percentage}% do limite de ${actionType}. Considere fazer upgrade.`,
      });
    }
  };

  const getLimitStatus = (actionType: 'clients' | 'appointments' | 'reports') => {
    const resource = usage?.[actionType];
    
    if (!resource) {
      return { status: 'unknown', message: 'Carregando...' };
    }
    
    if (resource.limit === null) {
      return { status: 'unlimited', message: 'Ilimitado' };
    }
    
    const remaining = resource.limit - resource.current;
    
    if (remaining <= 0) {
      return { status: 'exceeded', message: 'Limite atingido' };
    }
    
    if (resource.percentage >= 80) {
      return { status: 'warning', message: `${remaining} restantes` };
    }
    
    return { status: 'ok', message: `${remaining}/${resource.limit}` };
  };

  return {
    checkLimit,
    checkAndIncrement,
    showLimitWarning,
    getLimitStatus,
    subscription,
    usage,
  };
};

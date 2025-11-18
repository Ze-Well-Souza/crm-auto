import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  max_appointments_per_month: number | null;
  max_active_clients: number | null;
  max_reports_per_month: number | null;
  features: string[];
  is_active: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'trial' | 'active' | 'cancelled' | 'past_due' | 'expired';
  trial_ends_at: string | null;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  current_appointments_count: number;
  current_clients_count: number;
  current_reports_count: number;
  plan?: SubscriptionPlan;
}

export interface SubscriptionUsage {
  clients: { current: number; limit: number | null; percentage: number };
  appointments: { current: number; limit: number | null; percentage: number };
  reports: { current: number; limit: number | null; percentage: number };
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [usage, setUsage] = useState<SubscriptionUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Buscar assinatura ativa
      const { data: subscriptionData, error: subError } = await supabase
        .from('partner_subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('partner_id', user.id)
        .in('status', ['trial', 'active'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (subError) {
        // Se não tem assinatura, criar uma trial automática
        if (subError.code === 'PGRST116') {
          await createTrialSubscription(user.id);
          await loadSubscription();
          return;
        }
        throw subError;
      }

      setSubscription(subscriptionData);
      setPlan(subscriptionData?.plan || null);
      
      // Calcular uso
      const usageData = subscriptionData ? calculateUsage(subscriptionData) : null;
      setUsage(usageData);

    } catch (err: any) {
      console.error('Error loading subscription:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTrialSubscription = async (userId: string) => {
    try {
      // Buscar plano Profissional para trial
      const { data: plans } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('name', 'Profissional')
        .single();

      if (!plans) throw new Error('Plano Profissional não encontrado');

      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14); // 14 dias

      const currentPeriodEnd = new Date();
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

      await supabase.from('partner_subscriptions').insert({
        partner_id: userId,
        plan_id: plans.id,
        status: 'trial',
        trial_ends_at: trialEndsAt.toISOString(),
        current_period_start: new Date().toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        current_appointments_count: 0,
        current_clients_count: 0,
        current_reports_count: 0,
      });
    } catch (err) {
      console.error('Error creating trial:', err);
      throw err;
    }
  };

  const calculateUsage = (sub: UserSubscription): SubscriptionUsage => {
    const calculatePercentage = (current: number, limit: number | null) => {
      if (limit === null) return 0; // Ilimitado
      return Math.round((current / limit) * 100);
    };

    return {
      clients: {
        current: sub.current_clients_count,
        limit: sub.plan?.max_active_clients || null,
        percentage: calculatePercentage(sub.current_clients_count, sub.plan?.max_active_clients || null),
      },
      appointments: {
        current: sub.current_appointments_count,
        limit: sub.plan?.max_appointments_per_month || null,
        percentage: calculatePercentage(sub.current_appointments_count, sub.plan?.max_appointments_per_month || null),
      },
      reports: {
        current: sub.current_reports_count,
        limit: sub.plan?.max_reports_per_month || null,
        percentage: calculatePercentage(sub.current_reports_count, sub.plan?.max_reports_per_month || null),
      },
    };
  };

  const hasFeature = (feature: string): boolean => {
    if (!plan) return false;
    return plan.features?.includes(feature) || false;
  };

  const isTrialActive = (): boolean => {
    if (!subscription) return false;
    if (subscription.status !== 'trial') return false;
    if (!subscription.trial_ends_at) return false;
    
    const trialEnd = new Date(subscription.trial_ends_at);
    return trialEnd > new Date();
  };

  const getTrialDaysRemaining = (): number => {
    if (!subscription?.trial_ends_at) return 0;
    
    const trialEnd = new Date(subscription.trial_ends_at);
    const now = new Date();
    const diff = trialEnd.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const canPerformAction = (actionType: 'clients' | 'appointments' | 'reports'): boolean => {
    if (!subscription || !usage) return false;
    
    const resource = usage[actionType];
    
    // Ilimitado
    if (resource.limit === null) return true;
    
    // Verificar limite
    return resource.current < resource.limit;
  };

  const incrementUsage = async (actionType: 'clients' | 'appointments' | 'reports') => {
    if (!subscription) return;

    const field = `current_${actionType}_count`;
    
    const { error } = await supabase
      .from('partner_subscriptions')
      .update({ [field]: subscription[field as keyof UserSubscription] as number + 1 })
      .eq('id', subscription.id);

    if (!error) {
      await loadSubscription();
    }
  };

  const refresh = () => {
    loadSubscription();
  };

  return {
    subscription,
    plan,
    usage,
    loading,
    error,
    hasFeature,
    isTrialActive,
    getTrialDaysRemaining,
    canPerformAction,
    incrementUsage,
    refresh,
  };
};

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Rocket } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  price: number;
  billing_cycle: string;
  max_appointments_per_month: number | null;
  max_active_clients: number | null;
  max_reports_per_month: number | null;
  features: string[];
  description: string;
}

export const PlanSelector = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    loadPlans();
  }, [billingCycle]);

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('billing_cycle', billingCycle)
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (err) {
      console.error('Error loading plans:', err);
      toast.error('Erro ao carregar planos');
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (name: string) => {
    if (name.includes('Básico')) return <Zap className="h-8 w-8" />;
    if (name.includes('Profissional')) return <Crown className="h-8 w-8" />;
    if (name.includes('Enterprise')) return <Rocket className="h-8 w-8" />;
    return <Zap className="h-8 w-8" />;
  };

  const handleSelectPlan = async (planId: string) => {
    try {
      toast.info('Redirecionando para checkout...', {
        description: 'Aguarde enquanto preparamos seu checkout.'
      });

      const { createCheckoutSession } = await import('@/lib/stripe-client');
      const { url } = await createCheckoutSession({
        planId,
        billingCycle
      });

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      toast.error('Erro ao processar pagamento', {
        description: 'Por favor, tente novamente.'
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando planos...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Toggle Mensal/Anual */}
      <div className="flex justify-center gap-4">
        <Button
          variant={billingCycle === 'monthly' ? 'default' : 'outline'}
          onClick={() => setBillingCycle('monthly')}
        >
          Mensal
        </Button>
        <Button
          variant={billingCycle === 'yearly' ? 'default' : 'outline'}
          onClick={() => setBillingCycle('yearly')}
        >
          Anual
          <Badge variant="secondary" className="ml-2">-20%</Badge>
        </Button>
      </div>

      {/* Grid de Planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className="relative p-6 flex flex-col hover:shadow-lg transition-shadow"
          >
            {plan.name.includes('Profissional') && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Mais Popular
              </Badge>
            )}

            <div className="text-center mb-6">
              <div className="flex justify-center mb-4 text-primary">
                {getPlanIcon(plan.name)}
              </div>
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold mb-1">
                R$ {plan.price}
                <span className="text-base font-normal text-muted-foreground">
                  /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                </span>
              </div>
              {plan.name.includes('Profissional') && (
                <p className="text-sm text-green-600 font-medium">
                  14 dias grátis
                </p>
              )}
            </div>

            <div className="flex-1 space-y-3 mb-6">
              <div className="text-sm font-medium">
                {plan.max_active_clients === null ? 'Clientes ilimitados' : `${plan.max_active_clients} clientes`}
              </div>
              <div className="text-sm font-medium">
                {plan.max_appointments_per_month === null ? 'Agendamentos ilimitados' : `${plan.max_appointments_per_month} agendamentos/mês`}
              </div>
              <div className="text-sm font-medium">
                {plan.max_reports_per_month === null ? 'Relatórios ilimitados' : `${plan.max_reports_per_month} relatórios/mês`}
              </div>
              
              <div className="border-t pt-3 mt-3">
                {plan.features?.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm mb-2">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => handleSelectPlan(plan.id)}
              className="w-full"
              variant={plan.name.includes('Profissional') ? 'default' : 'outline'}
            >
              {plan.name.includes('Profissional') ? 'Iniciar Trial Grátis' : 'Selecionar Plano'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

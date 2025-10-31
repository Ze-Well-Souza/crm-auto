import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action_type } = await req.json();

    // 1. Buscar assinatura ativa do usuário
    const { data: subscription, error: subError } = await supabaseClient
      .from('partner_subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('partner_id', user.id)
      .eq('status', 'active')
      .single();

    if (subError || !subscription) {
      console.error('Subscription error:', subError);
      return new Response(
        JSON.stringify({ 
          canProceed: false, 
          error: 'Nenhuma assinatura ativa encontrada',
          current: 0,
          limit: 0
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Determinar tabela e limite com base no tipo de ação
    let tableName: string;
    let limitField: string;
    let filterField = 'user_id';

    switch (action_type) {
      case 'clients':
        tableName = 'clients';
        limitField = 'max_active_clients';
        break;
      case 'appointments':
        tableName = 'appointments';
        limitField = 'max_appointments_per_month';
        break;
      case 'reports':
        tableName = 'reports';
        limitField = 'max_reports_per_month';
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action_type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // 3. Contar uso atual
    const { count, error: countError } = await supabaseClient
      .from(tableName)
      .select('*', { count: 'exact', head: true })
      .eq(filterField, user.id);

    if (countError) {
      console.error('Count error:', countError);
      return new Response(
        JSON.stringify({ 
          canProceed: false,
          error: 'Erro ao verificar uso atual',
          current: 0,
          limit: 0
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Verificar limite
    const limit = subscription.plan[limitField];
    const currentCount = count || 0;
    
    // Se limite for null, é ilimitado
    const canProceed = limit === null || currentCount < limit;
    
    const percentage = limit ? Math.round((currentCount / limit) * 100) : 0;

    console.log('Validation result:', {
      user_id: user.id,
      action_type,
      currentCount,
      limit,
      canProceed,
      percentage,
      plan: subscription.plan.name
    });

    return new Response(
      JSON.stringify({ 
        canProceed,
        current: currentCount,
        limit: limit || 'unlimited',
        percentage,
        plan_name: subscription.plan.name,
        message: canProceed 
          ? 'Limite disponível' 
          : `Você atingiu o limite de ${limit} ${action_type} do seu plano ${subscription.plan.name}. Faça upgrade para continuar.`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in validate-plan-limit:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        canProceed: false,
        current: 0,
        limit: 0
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, userId, newPlanId, reason } = await req.json()

    console.log('Processing subscription change:', { action, userId, newPlanId })

    if (!userId) {
      throw new Error('userId is required')
    }

    // Buscar assinatura atual
    const { data: currentSub, error: fetchError } = await supabaseAdmin
      .from('partner_subscriptions')
      .select('*, plan:subscription_plans(*)')
      .eq('partner_id', userId)
      .in('status', ['active', 'trial'])
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch subscription: ${fetchError.message}`)
    }

    if (!currentSub) {
      throw new Error('No active subscription found')
    }

    switch (action) {
      case 'upgrade': {
        if (!newPlanId) {
          throw new Error('newPlanId is required for upgrade')
        }

        // Buscar novo plano
        const { data: newPlan, error: planError } = await supabaseAdmin
          .from('subscription_plans')
          .select('*')
          .eq('id', newPlanId)
          .single()

        if (planError || !newPlan) {
          throw new Error('New plan not found')
        }

        // Atualizar assinatura imediatamente
        const { error: updateError } = await supabaseAdmin
          .from('partner_subscriptions')
          .update({
            plan_id: newPlanId,
            status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentSub.id)

        if (updateError) throw updateError

        // Criar log de auditoria
        await supabaseAdmin.from('subscription_audit_log').insert({
          user_id: userId,
          action: 'upgrade',
          resource_type: 'subscription',
          details: {
            old_plan: currentSub.plan.name,
            new_plan: newPlan.name,
            timestamp: new Date().toISOString(),
          },
        })

        console.log('Upgrade completed:', { userId, oldPlan: currentSub.plan.name, newPlan: newPlan.name })

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Upgrade realizado com sucesso',
            data: { oldPlan: currentSub.plan.name, newPlan: newPlan.name },
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'downgrade': {
        if (!newPlanId) {
          throw new Error('newPlanId is required for downgrade')
        }

        // Buscar novo plano
        const { data: newPlan, error: planError } = await supabaseAdmin
          .from('subscription_plans')
          .select('*')
          .eq('id', newPlanId)
          .single()

        if (planError || !newPlan) {
          throw new Error('New plan not found')
        }

        // Marcar para downgrade no fim do período
        const { error: updateError } = await supabaseAdmin
          .from('partner_subscriptions')
          .update({
            cancel_at_period_end: true,
            pending_plan_id: newPlanId, // Campo para armazenar plano futuro
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentSub.id)

        if (updateError) throw updateError

        // Criar log de auditoria
        await supabaseAdmin.from('subscription_audit_log').insert({
          user_id: userId,
          action: 'scheduled_downgrade',
          resource_type: 'subscription',
          details: {
            current_plan: currentSub.plan.name,
            pending_plan: newPlan.name,
            effective_date: currentSub.current_period_end,
            reason: reason || 'User requested downgrade',
          },
        })

        console.log('Downgrade scheduled:', { 
          userId, 
          currentPlan: currentSub.plan.name, 
          newPlan: newPlan.name,
          effectiveDate: currentSub.current_period_end 
        })

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Downgrade agendado para o fim do período',
            data: {
              currentPlan: currentSub.plan.name,
              newPlan: newPlan.name,
              effectiveDate: currentSub.current_period_end,
            },
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'cancel': {
        // Marcar para cancelamento no fim do período
        const { error: updateError } = await supabaseAdmin
          .from('partner_subscriptions')
          .update({
            cancel_at_period_end: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentSub.id)

        if (updateError) throw updateError

        // Criar log de auditoria
        await supabaseAdmin.from('subscription_audit_log').insert({
          user_id: userId,
          action: 'scheduled_cancellation',
          resource_type: 'subscription',
          details: {
            plan: currentSub.plan.name,
            effective_date: currentSub.current_period_end,
            reason: reason || 'User requested cancellation',
          },
        })

        console.log('Cancellation scheduled:', { userId, plan: currentSub.plan.name })

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Cancelamento agendado para o fim do período',
            data: {
              plan: currentSub.plan.name,
              effectiveDate: currentSub.current_period_end,
            },
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'reactivate': {
        // Reativar assinatura (remover flag de cancelamento)
        const { error: updateError } = await supabaseAdmin
          .from('partner_subscriptions')
          .update({
            cancel_at_period_end: false,
            pending_plan_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentSub.id)

        if (updateError) throw updateError

        // Criar log de auditoria
        await supabaseAdmin.from('subscription_audit_log').insert({
          user_id: userId,
          action: 'reactivation',
          resource_type: 'subscription',
          details: {
            plan: currentSub.plan.name,
            timestamp: new Date().toISOString(),
          },
        })

        console.log('Subscription reactivated:', { userId, plan: currentSub.plan.name })

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Assinatura reativada com sucesso',
            data: { plan: currentSub.plan.name },
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        throw new Error(`Unknown action: ${action}`)
    }
  } catch (error) {
    console.error('Error handling subscription change:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

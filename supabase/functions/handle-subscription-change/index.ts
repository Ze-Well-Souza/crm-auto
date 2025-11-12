import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { RateLimiter, RATE_LIMIT_PRESETS, createRateLimitIdentifier } from '../_shared/rate-limit.ts'
import { generateRequestId, logWithRequestId } from '../_shared/logging.ts'

// Input validation schema
const subscriptionChangeSchema = z.object({
  action: z.enum(['upgrade', 'downgrade', 'cancel', 'renew']),
  userId: z.string().uuid(),
  newPlanId: z.string().uuid().optional(),
  reason: z.string().optional()
});

serve(async (req) => {
  const requestId = generateRequestId();
  
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Initialize rate limiter for subscription management
    const kv = await Deno.openKv();
    const rateLimiter = new RateLimiter(RATE_LIMIT_PRESETS.api, kv);
    
    // Check rate limit by IP for subscription changes
    const clientIp = createRateLimitIdentifier(req, 'ip');
    const rateLimitResult = await rateLimiter.checkLimit(`subscription_change:${clientIp}`);
    
    if (!rateLimitResult.allowed) {
      logWithRequestId(requestId, 'Rate limit exceeded for subscription change', { clientIp, retryAfter: rateLimitResult.retryAfter });
      return new Response(
        JSON.stringify({ 
          error: 'Muitas requisições. Por favor, tente novamente mais tarde.',
          retryAfter: rateLimitResult.retryAfter 
        }),
        {
          headers: { 
            ...corsHeaders(req.headers.get('origin')), 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
          },
          status: 429,
        }
      );
    }

    logWithRequestId(requestId, 'Rate limit check passed for subscription change', { 
      clientIp, 
      remaining: rateLimitResult.remaining 
    });

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    
    logWithRequestId(requestId, 'Processing subscription change request', { body });
    
    // Validate input
    const validationResult = subscriptionChangeSchema.safeParse(body);
    if (!validationResult.success) {
      logWithRequestId(requestId, 'Invalid input data for subscription change', {
        errors: validationResult.error.errors,
        body
      });
      return new Response(
        JSON.stringify({ 
          error: 'Dados inválidos', 
          details: validationResult.error.errors 
        }),
        {
          headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const { action, userId, newPlanId, reason } = validationResult.data;

    logWithRequestId(requestId, 'Processing subscription change', {
      action,
      userId,
      newPlanId,
      reason
    });

    // Buscar assinatura atual
    const { data: currentSub, error: fetchError } = await supabaseAdmin
      .from('partner_subscriptions')
      .select('*')
      .eq('partner_id', userId)
      .single();

    if (fetchError) {
      logWithRequestId(requestId, 'Error fetching current subscription', {
        userId,
        error: fetchError.message
      });
      throw new Error('Erro ao buscar assinatura atual');
    }

    if (!currentSub) {
      logWithRequestId(requestId, 'No subscription found for user', { userId });
      return new Response(
        JSON.stringify({ error: 'Assinatura não encontrada' }),
        {
          headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    let result;

    switch (action) {
      case 'upgrade':
      case 'downgrade':
        if (!newPlanId) {
          logWithRequestId(requestId, 'newPlanId required for upgrade/downgrade', { action, userId });
          return new Response(
            JSON.stringify({ error: 'newPlanId é obrigatório para upgrade/downgrade' }),
            {
              headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }
        
        // Buscar novo plano
        const { data: newPlan, error: planError } = await supabaseAdmin
          .from('subscription_plans')
          .select('*')
          .eq('id', newPlanId)
          .single();

        if (planError || !newPlan) {
          logWithRequestId(requestId, 'New plan not found', { newPlanId, error: planError?.message });
          return new Response(
            JSON.stringify({ error: 'Novo plano não encontrado' }),
            {
              headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
              status: 404,
            }
          );
        }

        // Atualizar para novo plano
        result = await supabaseAdmin
          .from('partner_subscriptions')
          .update({
            plan_id: newPlanId,
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('partner_id', userId);

        logWithRequestId(requestId, 'Plan changed successfully', {
          userId,
          oldPlanId: currentSub.plan_id,
          newPlanId,
          action
        });
        break;

      case 'cancel':
        result = await supabaseAdmin
          .from('partner_subscriptions')
          .update({
            status: 'cancelled',
            cancel_reason: reason,
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('partner_id', userId);

        logWithRequestId(requestId, 'Subscription cancelled', {
          userId,
          reason,
          subscriptionId: currentSub.id
        });
        break;

      case 'renew':
        // Calcular nova data de expiração (30 dias a partir de hoje)
        const newPeriodEnd = new Date();
        newPeriodEnd.setDate(newPeriodEnd.getDate() + 30);

        result = await supabaseAdmin
          .from('partner_subscriptions')
          .update({
            status: 'active',
            current_period_end: newPeriodEnd.toISOString(),
            cancel_at_period_end: false,
            updated_at: new Date().toISOString()
          })
          .eq('partner_id', userId);

        logWithRequestId(requestId, 'Subscription renewed', {
          userId,
          newPeriodEnd: newPeriodEnd.toISOString(),
          subscriptionId: currentSub.id
        });
        break;

      default:
        logWithRequestId(requestId, 'Invalid action', { action, userId });
        return new Response(
          JSON.stringify({ error: 'Ação inválida' }),
          {
            headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
            status: 400,
          }
        );
    }

    if (result.error) {
      logWithRequestId(requestId, 'Error updating subscription', {
        userId,
        action,
        error: result.error.message
      });
      throw result.error;
    }

    logWithRequestId(requestId, 'Subscription change completed successfully', {
      userId,
      action,
      newPlanId
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Assinatura atualizada com sucesso',
        action,
        userId
      }),
      {
        headers: { 
          ...corsHeaders(req.headers.get('origin')), 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
        },
        status: 200,
      }
    );

  } catch (error) {
    logWithRequestId(requestId, 'Error processing subscription change', {
      error: error.message,
      stack: error.stack
    });
    return new Response(
      JSON.stringify({ 
        error: 'Erro ao processar mudança de assinatura',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
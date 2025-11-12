import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { RateLimiter, RATE_LIMIT_PRESETS, createRateLimitIdentifier } from '../_shared/rate-limit.ts';
import { generateRequestId, logWithRequestId } from '../_shared/logging.ts';

// Input validation schema
const validateLimitSchema = z.object({
  feature: z.enum(['clients', 'service_orders', 'appointments', 'users']),
  requestedCount: z.number().int().positive().optional()
});

serve(async (req) => {
  const requestId = generateRequestId();
  
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Initialize rate limiter
    const kv = await Deno.openKv();
    const rateLimiter = new RateLimiter(RATE_LIMIT_PRESETS.api, kv);
    
    // Check rate limit by user (since this is an authenticated endpoint)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      logWithRequestId(requestId, 'Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        {
          headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    // Extract user ID from JWT token (basic extraction - in production use proper JWT parsing)
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;
    
    const rateLimitResult = await rateLimiter.checkLimit(`validate_plan:${userId}`);
    
    if (!rateLimitResult.allowed) {
      logWithRequestId(requestId, 'Rate limit exceeded', { userId, retryAfter: rateLimitResult.retryAfter });
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

    logWithRequestId(requestId, 'Rate limit check passed', { 
      userId, 
      remaining: rateLimitResult.remaining 
    });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      logWithRequestId(requestId, 'Authentication failed - no user found');
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        {
          headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    const body = await req.json();
    
    logWithRequestId(requestId, 'Validating plan limit', { userId: user.id, feature: body.feature });
    
    // Validate input
    const validationResult = validateLimitSchema.safeParse(body);
    if (!validationResult.success) {
      logWithRequestId(requestId, 'Input validation failed', { errors: validationResult.error.errors });
      return new Response(
        JSON.stringify({ error: 'Dados inválidos', details: validationResult.error.errors }),
        {
          headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const { feature, requestedCount } = validationResult.data;

    // Buscar assinatura ativa do usuário
    const { data: subscription, error: subError } = await supabaseClient
      .from('partner_subscriptions')
      .select(`
        *,
        subscription_plans (
          display_name,
          max_clients,
          max_service_orders,
          max_appointments,
          max_users
        )
      `)
      .eq('partner_id', user.id)
      .eq('status', 'active')
      .single();

    if (subError || !subscription) {
      logWithRequestId(requestId, 'Subscription not found', { userId: user.id, error: subError });
      return new Response(
        JSON.stringify({ error: 'Assinatura não encontrada' }),
        {
          headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    const plan = subscription.subscription_plans;
    const currentUsage = subscription.current_usage || {};
    
    // Obter uso atual baseado na feature
    let currentCount = 0;
    let maxAllowed = 0;
    
    switch (feature) {
      case 'clients':
        currentCount = currentUsage.clients || 0;
        maxAllowed = plan.max_clients;
        break;
      case 'service_orders':
        currentCount = currentUsage.service_orders || 0;
        maxAllowed = plan.max_service_orders;
        break;
      case 'appointments':
        currentCount = currentUsage.appointments || 0;
        maxAllowed = plan.max_appointments;
        break;
      case 'users':
        currentCount = currentUsage.users || 0;
        maxAllowed = plan.max_users;
        break;
    }

    // Se for ilimitado (-1), sempre permitir
    if (maxAllowed === -1) {
      logWithRequestId(requestId, 'Plan limit validation - unlimited', { 
        userId: user.id, 
        feature, 
        current: currentCount, 
        limit: 'unlimited' 
      });
      return new Response(
        JSON.stringify({ 
          allowed: true, 
          current: currentCount, 
          limit: 'unlimited',
          remaining: 'unlimited'
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
    }

    // Verificar se tem espaço disponível
    const remaining = maxAllowed - currentCount;
    const allowed = requestedCount ? (remaining >= requestedCount) : (remaining > 0);

    logWithRequestId(requestId, 'Plan limit validation result', { 
      userId: user.id, 
      feature, 
      current: currentCount, 
      limit: maxAllowed, 
      remaining, 
      allowed, 
      requested: requestedCount 
    });

    return new Response(
      JSON.stringify({ 
        allowed, 
        current: currentCount, 
        limit: maxAllowed,
        remaining,
        requested: requestedCount
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
    logWithRequestId(requestId, 'Error validating plan limit', { error: error.message, stack: error.stack });
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
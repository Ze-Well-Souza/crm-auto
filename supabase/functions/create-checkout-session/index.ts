import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { RateLimiter, RATE_LIMIT_PRESETS, createRateLimitIdentifier } from '../_shared/rate-limit.ts'
import { generateRequestId, logWithRequestId } from '../_shared/logging.ts'

// Input validation schema
const checkoutSchema = z.object({
  planId: z.string().uuid(),
  billingCycle: z.enum(['monthly', 'yearly'])
})

serve(async (req) => {
  const requestId = generateRequestId()
  
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Initialize rate limiter
    const kv = await Deno.openKv()
    const rateLimiter = new RateLimiter(RATE_LIMIT_PRESETS.auth, kv)
    
    // Check rate limit by IP
    const clientIp = createRateLimitIdentifier(req, 'ip')
    const rateLimitResult = await rateLimiter.checkLimit(`checkout:${clientIp}`)
    
    if (!rateLimitResult.allowed) {
      logWithRequestId(requestId, 'Rate limit exceeded', { clientIp, retryAfter: rateLimitResult.retryAfter })
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
      )
    }

    logWithRequestId(requestId, 'Rate limit check passed', { 
      clientIp, 
      remaining: rateLimitResult.remaining 
    })

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      logWithRequestId(requestId, 'Authentication failed - no user found')
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        {
          headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    const body = await req.json()
    
    logWithRequestId(requestId, 'Creating checkout session', { userId: user.id, planId: body.planId })
    
    // Validate input
    const validationResult = checkoutSchema.safeParse(body)
    if (!validationResult.success) {
      logWithRequestId(requestId, 'Input validation failed', { errors: validationResult.error.errors })
      return new Response(
        JSON.stringify({ error: 'Dados inválidos', details: validationResult.error.errors }),
        {
          headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    const { planId, billingCycle } = validationResult.data

    // Buscar detalhes do plano
    const { data: plan, error: planError } = await supabaseClient
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (planError || !plan) {
      logWithRequestId(requestId, 'Plan not found', { planId, error: planError })
      return new Response(
        JSON.stringify({ error: 'Plano não encontrado' }),
        {
          headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
          status: 404,
        }
      )
    }

    const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly
    const interval = billingCycle === 'monthly' ? 'month' : 'year'

    // Criar ou recuperar Stripe Customer
    let stripeCustomerId: string

    const { data: existingSub } = await supabaseClient
      .from('partner_subscriptions')
      .select('stripe_customer_id')
      .eq('partner_id', user.id)
      .single()

    if (existingSub?.stripe_customer_id) {
      stripeCustomerId = existingSub.stripe_customer_id
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      stripeCustomerId = customer.id
    }

    // Criar Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: plan.display_name,
              description: `Plano ${plan.display_name} - ${billingCycle === 'monthly' ? 'Mensal' : 'Anual'}`,
            },
            unit_amount: Math.round(price * 100), // convertendo para centavos
            recurring: {
              interval: interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/planos?success=true`,
      cancel_url: `${req.headers.get('origin')}/planos?canceled=true`,
      metadata: {
        user_id: user.id,
        plan_id: planId,
        billing_cycle: billingCycle,
      },
    })

    logWithRequestId(requestId, 'Checkout session created successfully', { 
      sessionId: session.id,
      userId: user.id 
    })

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { 
          ...corsHeaders(req.headers.get('origin')), 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
        },
        status: 200,
      }
    )
  } catch (error) {
    logWithRequestId(requestId, 'Error creating checkout session', { error: error.message, stack: error.stack })
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
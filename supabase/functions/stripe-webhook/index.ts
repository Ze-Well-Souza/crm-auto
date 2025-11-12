import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { RateLimiter, RATE_LIMIT_PRESETS, createRateLimitIdentifier } from '../_shared/rate-limit.ts'
import { generateRequestId, logWithRequestId } from '../_shared/logging.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  const requestId = generateRequestId()
  
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Initialize rate limiter for webhook endpoints
    const kv = await Deno.openKv()
    const rateLimiter = new RateLimiter(RATE_LIMIT_PRESETS.webhook, kv)
    
    // Check rate limit by IP for webhook processing
    const clientIp = createRateLimitIdentifier(req, 'ip')
    const rateLimitResult = await rateLimiter.checkLimit(`stripe_webhook:${clientIp}`)
    
    if (!rateLimitResult.allowed) {
      logWithRequestId(requestId, 'Rate limit exceeded for Stripe webhook', { clientIp, retryAfter: rateLimitResult.retryAfter })
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

    logWithRequestId(requestId, 'Rate limit check passed for Stripe webhook', { 
      clientIp, 
      remaining: rateLimitResult.remaining 
    })

    const signature = req.headers.get('stripe-signature')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!signature || !webhookSecret) {
      logWithRequestId(requestId, 'Missing signature or webhook secret', {
        hasSignature: !!signature,
        hasWebhookSecret: !!webhookSecret
      })
      return new Response(
        JSON.stringify({ error: 'Missing signature or webhook secret' }),
        {
          headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    const body = await req.text()
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    )

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    logWithRequestId(requestId, 'Processing webhook event', {
      eventType: event.type,
      eventId: event.id,
      timestamp: event.created
    })

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const planId = session.metadata?.plan_id

        if (!userId || !planId) {
          logWithRequestId(requestId, 'Missing metadata in checkout session', {
            metadata: session.metadata,
            sessionId: session.id
          })
          throw new Error('Missing metadata in checkout session')
        }

        // Calcular data de expiração (30 dias)
        const currentPeriodStart = new Date()
        const currentPeriodEnd = new Date()
        currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30)

        // Criar ou atualizar assinatura
        const { error: subError } = await supabaseAdmin
          .from('partner_subscriptions')
          .upsert({
            partner_id: userId,
            plan_id: planId,
            status: 'active',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            current_period_start: currentPeriodStart.toISOString(),
            current_period_end: currentPeriodEnd.toISOString(),
            cancel_at_period_end: false,
          }, {
            onConflict: 'partner_id'
          })

        if (subError) {
          logWithRequestId(requestId, 'Error upserting subscription', {
            userId,
            planId,
            error: subError.message
          })
          throw subError
        }

        logWithRequestId(requestId, 'Subscription activated', { userId, planId, sessionId: session.id })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (!subscriptionId) {
          logWithRequestId(requestId, 'Missing subscription ID in invoice.payment_succeeded', {
            invoiceId: invoice.id
          })
          break
        }

        // Buscar subscription pelo stripe_subscription_id
        const { data: subscription, error: fetchError } = await supabaseAdmin
          .from('partner_subscriptions')
          .select('*')
          .eq('stripe_subscription_id', subscriptionId)
          .single()

        if (fetchError || !subscription) {
          logWithRequestId(requestId, 'Subscription not found for renewal', {
            subscriptionId,
            error: fetchError?.message
          })
          break
        }

        // Renovar assinatura (adicionar 30 dias)
        const newPeriodEnd = new Date(subscription.current_period_end)
        newPeriodEnd.setDate(newPeriodEnd.getDate() + 30)

        const { error: updateError } = await supabaseAdmin
          .from('partner_subscriptions')
          .update({
            status: 'active',
            current_period_start: subscription.current_period_end,
            current_period_end: newPeriodEnd.toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionId)

        if (updateError) {
          logWithRequestId(requestId, 'Error renewing subscription', {
            subscriptionId,
            error: updateError.message
          })
          throw updateError
        }

        logWithRequestId(requestId, 'Subscription renewed', { subscriptionId, userId: subscription.partner_id })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Cancelar assinatura
        const { error: cancelError } = await supabaseAdmin
          .from('partner_subscriptions')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', subscription.id)

        if (cancelError) {
          logWithRequestId(requestId, 'Error cancelling subscription', {
            subscriptionId: subscription.id,
            error: cancelError.message
          })
          throw cancelError
        }

        logWithRequestId(requestId, 'Subscription cancelled', { subscriptionId: subscription.id })
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        // Atualizar status se necessário
        const status = subscription.status === 'active' ? 'active' : 
                      subscription.status === 'past_due' ? 'past_due' : 
                      subscription.status === 'canceled' ? 'cancelled' : 'active'

        const { error: updateError } = await supabaseAdmin
          .from('partner_subscriptions')
          .update({
            status,
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', subscription.id)

        if (updateError) {
          logWithRequestId(requestId, 'Error updating subscription', {
            subscriptionId: subscription.id,
            error: updateError.message
          })
          throw updateError
        }

        logWithRequestId(requestId, 'Subscription updated', { 
          subscriptionId: subscription.id,
          newStatus: status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        })
        break
      }

      default:
        logWithRequestId(requestId, 'Unhandled event type', { eventType: event.type, eventId: event.id })
    }

    return new Response(
      JSON.stringify({ received: true }),
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
    logWithRequestId(requestId, 'Webhook processing error', {
      error: error.message,
      stack: error.stack
    })
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
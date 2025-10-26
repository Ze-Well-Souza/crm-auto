import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

  if (!signature || !webhookSecret) {
    return new Response('Missing signature or webhook secret', { status: 400 })
  }

  try {
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

    console.log('Processing webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const planId = session.metadata?.plan_id

        if (!userId || !planId) {
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

        if (subError) throw subError

        console.log('Subscription activated for user:', userId)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (!subscriptionId) break

        // Buscar subscription pelo stripe_subscription_id
        const { data: subscription, error: fetchError } = await supabaseAdmin
          .from('partner_subscriptions')
          .select('*')
          .eq('stripe_subscription_id', subscriptionId)
          .single()

        if (fetchError || !subscription) {
          console.error('Subscription not found:', subscriptionId)
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

        if (updateError) throw updateError

        console.log('Subscription renewed:', subscriptionId)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Cancelar assinatura
        const { error: cancelError } = await supabaseAdmin
          .from('partner_subscriptions')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', subscription.id)

        if (cancelError) throw cancelError

        console.log('Subscription cancelled:', subscription.id)
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

        if (updateError) throw updateError

        console.log('Subscription updated:', subscription.id)
        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

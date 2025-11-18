import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Resend } from 'npm:resend@4.0.0'
import React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { generateRequestId, logWithRequestId } from '../_shared/logging.ts'
import { AppointmentConfirmation } from './_templates/appointment-confirmation.tsx'
import { AppointmentReminder } from './_templates/appointment-reminder.tsx'
import { PaymentConfirmation } from './_templates/payment-confirmation.tsx'
import { SubscriptionChange } from './_templates/subscription-change.tsx'
import { WelcomeEmail } from './_templates/welcome-email.tsx'
import { ReactivationEmail } from './_templates/reactivation-email.tsx'
import { QuotationEmail } from './_templates/quotation-email.tsx'
import { PasswordResetEmail } from './_templates/password-reset.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

interface EmailRequest {
  type: 'appointment' | 'appointment_reminder' | 'payment' | 'subscription' | 'welcome' | 'reactivation' | 'quotation' | 'password_reset'
  to: string
  data: any
}

serve(async (req) => {
  const requestId = generateRequestId()
  
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify user authentication
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

    const emailRequest: EmailRequest = await req.json()
    logWithRequestId(requestId, 'Processing email request', { 
      type: emailRequest.type, 
      userId: user.id 
    })

    let html: string
    let subject: string

    // Render appropriate email template
    switch (emailRequest.type) {
      case 'appointment':
        html = await renderAsync(
          React.createElement(AppointmentConfirmation, emailRequest.data)
        )
        subject = 'Confirmação de Agendamento - CRM Auto'
        break

      case 'appointment_reminder':
        html = await renderAsync(
          React.createElement(AppointmentReminder, emailRequest.data)
        )
        subject = '🔔 Lembrete: Seu agendamento é amanhã! - CRM Auto'
        break

      case 'payment':
        html = await renderAsync(
          React.createElement(PaymentConfirmation, emailRequest.data)
        )
        subject = 'Confirmação de Pagamento - CRM Auto'
        break

      case 'subscription':
        html = await renderAsync(
          React.createElement(SubscriptionChange, emailRequest.data)
        )
        subject = `${emailRequest.data.changeType === 'upgrade' ? 'Upgrade' : 'Alteração'} de Plano - CRM Auto`
        break

      case 'welcome':
        html = await renderAsync(
          React.createElement(WelcomeEmail, emailRequest.data)
        )
        subject = '🎉 Bem-vindo ao CRM Auto! Sua conta está pronta'
        break

      case 'reactivation':
        html = await renderAsync(
          React.createElement(ReactivationEmail, emailRequest.data)
        )
        subject = '💙 Sentimos sua falta! Que tal voltar?'
        break

      case 'quotation':
        html = await renderAsync(
          React.createElement(QuotationEmail, emailRequest.data)
        )
        subject = `📋 Cotação ${emailRequest.data.quotationNumber} - Confira nossa proposta`
        break

      case 'password_reset':
        html = await renderAsync(
          React.createElement(PasswordResetEmail, emailRequest.data)
        )
        subject = '🔐 Redefinição de Senha - CRM Auto'
        break

      default:
        throw new Error('Tipo de email inválido')
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'CRM Auto <onboarding@resend.dev>', // Altere para seu domínio verificado
      to: [emailRequest.to],
      subject,
      html,
    })

    if (error) {
      logWithRequestId(requestId, 'Error sending email', { error })
      throw error
    }

    logWithRequestId(requestId, 'Email sent successfully', { 
      emailId: data?.id,
      type: emailRequest.type 
    })

    // Log email in database
    await supabaseClient
      .from('email_log')
      .insert({
        partner_id: user.id,
        recipient: emailRequest.to,
        subject,
        status: 'sent',
        template: emailRequest.type,
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: data?.id,
        message: 'Email enviado com sucesso' 
      }),
      {
        headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    logWithRequestId(requestId, 'Error in send-notification-email', { 
      error: error.message,
      stack: error.stack 
    })

    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: 'Erro ao enviar email' 
      }),
      {
        headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

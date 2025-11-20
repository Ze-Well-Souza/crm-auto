import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Resend } from 'npm:resend@4.0.0'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { generateRequestId, logWithRequestId } from '../_shared/logging.ts'

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

    // Generate simple HTML email templates directly
    switch (emailRequest.type) {
      case 'appointment':
        subject = 'Confirmação de Agendamento - CRM Auto'
        html = `
          <h1>Confirmação de Agendamento</h1>
          <p>Olá ${emailRequest.data.clientName},</p>
          <p>Seu agendamento foi confirmado para ${emailRequest.data.date} às ${emailRequest.data.time}.</p>
          <p><strong>Serviço:</strong> ${emailRequest.data.service}</p>
          <p>Atenciosamente,<br>Equipe CRM Auto</p>
        `
        break

      case 'appointment_reminder':
        subject = '🔔 Lembrete: Seu agendamento é amanhã! - CRM Auto'
        html = `
          <h1>Lembrete de Agendamento</h1>
          <p>Olá ${emailRequest.data.clientName},</p>
          <p>Lembramos que você tem um agendamento amanhã às ${emailRequest.data.time}.</p>
          <p><strong>Serviço:</strong> ${emailRequest.data.service}</p>
          <p>Atenciosamente,<br>Equipe CRM Auto</p>
        `
        break

      case 'payment':
        subject = 'Confirmação de Pagamento - CRM Auto'
        html = `
          <h1>Pagamento Confirmado</h1>
          <p>Olá ${emailRequest.data.clientName},</p>
          <p>Confirmamos o recebimento do seu pagamento de R$ ${emailRequest.data.amount}.</p>
          <p>Atenciosamente,<br>Equipe CRM Auto</p>
        `
        break

      case 'subscription':
        subject = `${emailRequest.data.changeType === 'upgrade' ? 'Upgrade' : 'Alteração'} de Plano - CRM Auto`
        html = `
          <h1>Alteração de Plano</h1>
          <p>Olá,</p>
          <p>Seu plano foi atualizado para <strong>${emailRequest.data.planName}</strong>.</p>
          <p>Atenciosamente,<br>Equipe CRM Auto</p>
        `
        break

      case 'welcome':
        subject = '🎉 Bem-vindo ao CRM Auto! Sua conta está pronta'
        html = `
          <h1>Bem-vindo ao CRM Auto!</h1>
          <p>Olá ${emailRequest.data.userName},</p>
          <p>Sua conta foi criada com sucesso. Você está no plano <strong>${emailRequest.data.planName}</strong>.</p>
          <p>Atenciosamente,<br>Equipe CRM Auto</p>
        `
        break

      case 'reactivation':
        subject = '💙 Sentimos sua falta! Que tal voltar?'
        html = `
          <h1>Sentimos sua falta!</h1>
          <p>Olá ${emailRequest.data.clientName},</p>
          <p>Há algum tempo que não te vemos! Que tal agendar uma revisão?</p>
          <p>Atenciosamente,<br>Equipe CRM Auto</p>
        `
        break

      case 'quotation':
        subject = 'Orçamento - CRM Auto'
        html = `
          <h1>Orçamento</h1>
          <p>Olá ${emailRequest.data.clientName},</p>
          <p>Segue orçamento número <strong>${emailRequest.data.quotationNumber}</strong>.</p>
          <p>Valor total: R$ ${emailRequest.data.total}</p>
          <p>Atenciosamente,<br>Equipe CRM Auto</p>
        `
        break

      case 'password_reset':
        subject = '🔐 Redefinição de Senha - CRM Auto'
        html = `
          <h1>Redefinição de Senha</h1>
          <p>Você solicitou a redefinição de senha.</p>
          <p><a href="${emailRequest.data.resetLink}">Clique aqui para redefinir sua senha</a></p>
          <p>Atenciosamente,<br>Equipe CRM Auto</p>
        `
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

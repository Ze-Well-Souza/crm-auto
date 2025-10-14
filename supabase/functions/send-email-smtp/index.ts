import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string[];
  subject: string;
  content: string;
  isHtml?: boolean;
}

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
      throw new Error('Não autenticado');
    }

    const { to, subject, content, isHtml = false }: EmailRequest = await req.json();

    // Buscar configuração ativa do usuário
    const { data: emailConfig, error: configError } = await supabaseClient
      .from('email_configurations')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (configError || !emailConfig) {
      throw new Error('Configuração de email não encontrada. Configure seu email nas configurações do sistema.');
    }

    // Descriptografar senha (usar função simples por enquanto, melhorar depois)
    const password = atob(emailConfig.smtp_password_encrypted);

    // Usar nodemailer via npm CDN
    const nodemailer = await import('npm:nodemailer@6.9.7');
    
    const transporter = nodemailer.default.createTransport({
      host: emailConfig.smtp_host,
      port: emailConfig.smtp_port,
      secure: emailConfig.smtp_secure,
      auth: {
        user: emailConfig.smtp_username,
        pass: password,
      },
    });

    // Enviar para cada destinatário
    const results = [];
    for (const recipient of to) {
      const info = await transporter.sendMail({
        from: `"${emailConfig.from_name || 'Sistema'}" <${emailConfig.email}>`,
        to: recipient,
        subject: subject,
        text: !isHtml ? content : undefined,
        html: isHtml ? content : undefined,
      });

      results.push({
        recipient,
        messageId: info.messageId,
        success: true,
      });

      console.log(`Email enviado para ${recipient}: ${info.messageId}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        results,
        message: `Email enviado com sucesso para ${to.length} destinatário(s)`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Erro ao enviar email:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Erro ao enviar email',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

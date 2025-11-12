import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { RateLimiter, RATE_LIMIT_PRESETS, createRateLimitIdentifier } from '../_shared/rate-limit.ts';
import { generateRequestId, logWithRequestId } from '../_shared/logging.ts';

// Input validation schema
const emailSchema = z.object({
  to: z.array(z.string().email()).min(1).max(10),
  subject: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  isHtml: z.boolean().optional().default(false)
});

serve(async (req) => {
  const requestId = generateRequestId();
  
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Initialize rate limiter for email sending
    const kv = await Deno.openKv();
    const rateLimiter = new RateLimiter(RATE_LIMIT_PRESETS.email, kv);
    
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
    
    const rateLimitResult = await rateLimiter.checkLimit(`email:${userId}`);
    
    if (!rateLimitResult.allowed) {
      logWithRequestId(requestId, 'Rate limit exceeded for email', { userId, retryAfter: rateLimitResult.retryAfter });
      return new Response(
        JSON.stringify({ 
          error: 'Muitos emails. Por favor, tente novamente mais tarde.',
          retryAfter: rateLimitResult.retryAfter 
        }),
        {
          headers: { 
            ...corsHeaders(req.headers.get('origin')), 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': rateLimitResult.retryAfter?.toString() || '3600'
          },
          status: 429,
        }
      );
    }

    logWithRequestId(requestId, 'Rate limit check passed for email', { 
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
    
    logWithRequestId(requestId, 'Sending email', {
      userId: user.id,
      recipients: body.to?.length,
      subject: body.subject
    });
    
    // Validate input
    const validationResult = emailSchema.safeParse(body);
    if (!validationResult.success) {
      logWithRequestId(requestId, 'Invalid input data for email', {
        errors: validationResult.error.errors,
        body
      });
      return new Response(
        JSON.stringify({ 
          error: 'Dados de email inválidos', 
          details: validationResult.error.errors 
        }),
        {
          headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const { to, subject, content, isHtml } = validationResult.data;

    // Simple SMTP simulation (in production, use a real SMTP service)
    const emailData = {
      from: 'noreply@crmauto.com.br',
      to: to.join(', '),
      subject: subject,
      text: isHtml ? undefined : content,
      html: isHtml ? content : undefined,
      userId: user.id,
      timestamp: new Date().toISOString()
    };

    // Log email for development (in production, integrate with real SMTP)
    logWithRequestId(requestId, 'Email data prepared', {
      to: emailData.to,
      subject: emailData.subject,
      hasHtml: !!emailData.html,
      hasText: !!emailData.text
    });

    // Simulate email sending (replace with real SMTP integration)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store email log in database
    const { error: logError } = await supabaseClient
      .from('email_logs')
      .insert({
        user_id: user.id,
        to: to,
        subject: subject,
        content_preview: content.substring(0, 200),
        status: 'sent',
        sent_at: new Date().toISOString()
      });

    if (logError) {
      logWithRequestId(requestId, 'Error logging email', {
        userId: user.id,
        error: logError.message
      });
    }

    logWithRequestId(requestId, 'Email sent successfully', {
      to: to.length,
      subject,
      userId: user.id
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email enviado com sucesso',
        recipients: to.length,
        subject
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
    logWithRequestId(requestId, 'Error sending email', {
      error: error.message,
      stack: error.stack
    });
    return new Response(
      JSON.stringify({ 
        error: 'Erro ao enviar email',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
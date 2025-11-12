import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { RateLimiter, RATE_LIMIT_PRESETS, createRateLimitIdentifier } from '../_shared/rate-limit.ts';
import { generateRequestId, logWithRequestId } from '../_shared/logging.ts';

const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";
const WHATSAPP_PHONE_ID = Deno.env.get("WHATSAPP_PHONE_ID");
const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN");

// Input validation schema
const whatsappMessageSchema = z.object({
  to: z.string().regex(/^\d{10,15}$/, 'Phone number must be 10-15 digits'),
  message: z.string().min(1).max(1000),
  template: z.string().optional(),
  templateData: z.record(z.string()).optional()
});

serve(async (req) => {
  const requestId = generateRequestId();
  
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Initialize rate limiter
    const kv = await Deno.openKv();
    const rateLimiter = new RateLimiter(RATE_LIMIT_PRESETS.whatsapp, kv);
    
    // Check rate limit by IP for WhatsApp messages
    const clientIp = createRateLimitIdentifier(req, 'ip');
    const rateLimitResult = await rateLimiter.checkLimit(`whatsapp:${clientIp}`);
    
    if (!rateLimitResult.allowed) {
      logWithRequestId(requestId, 'Rate limit exceeded for WhatsApp', { clientIp, retryAfter: rateLimitResult.retryAfter });
      return new Response(
        JSON.stringify({ 
          error: 'Muitas mensagens. Por favor, tente novamente mais tarde.',
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

    logWithRequestId(requestId, 'Rate limit check passed for WhatsApp', { 
      clientIp, 
      remaining: rateLimitResult.remaining 
    });

    // Validate WhatsApp credentials
    if (!WHATSAPP_PHONE_ID || !WHATSAPP_TOKEN) {
      logWithRequestId(requestId, 'WhatsApp credentials not configured', {
        hasPhoneId: !!WHATSAPP_PHONE_ID,
        hasToken: !!WHATSAPP_TOKEN
      });
      return new Response(
        JSON.stringify({ error: 'WhatsApp credentials not configured' }),
        {
          headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    const body = await req.json();
    
    // Validate input
    const validationResult = whatsappMessageSchema.safeParse(body);
    if (!validationResult.success) {
      logWithRequestId(requestId, 'Invalid input data for WhatsApp', {
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

    const { to, message, template, templateData } = validationResult.data;

    logWithRequestId(requestId, 'Sending WhatsApp message', {
      to,
      template,
      hasTemplateData: !!templateData
    });

    let response;

    if (template) {
      // Send template message
      const templateMessage = {
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
          name: template,
          language: { code: "pt_BR" },
          components: templateData ? [{
            type: "body",
            parameters: Object.entries(templateData).map(([key, value]) => ({
              type: "text",
              text: value
            }))
          }] : []
        }
      };

      response = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateMessage),
      });
    } else {
      // Send text message
      const textMessage = {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: message }
      };

      response = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(textMessage),
      });
    }

    if (!response.ok) {
      const errorData = await response.text();
      logWithRequestId(requestId, 'WhatsApp API error', {
        status: response.status,
        error: errorData,
        to
      });
      throw new Error(`WhatsApp API error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    
    logWithRequestId(requestId, 'WhatsApp message sent successfully', {
      to,
      messageId: result.messages?.[0]?.id,
      template
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: result.messages?.[0]?.id 
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
    logWithRequestId(requestId, 'Error sending WhatsApp message', {
      error: error.message,
      stack: error.stack
    });
    return new Response(
      JSON.stringify({ 
        error: 'Erro ao enviar mensagem WhatsApp',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders(req.headers.get('origin')), 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
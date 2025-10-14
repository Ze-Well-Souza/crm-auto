import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";
const WHATSAPP_PHONE_ID = Deno.env.get("WHATSAPP_PHONE_ID");
const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WhatsAppMessageRequest {
  to: string; // Phone number in format: 5511999999999
  message: string;
  template?: string;
  templateData?: Record<string, string>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, message, template, templateData }: WhatsAppMessageRequest = await req.json();

    if (!WHATSAPP_PHONE_ID || !WHATSAPP_TOKEN) {
      throw new Error("WhatsApp credentials not configured");
    }

    // Remove formatting from phone number (keep only digits)
    const cleanPhone = to.replace(/\D/g, '');
    
    // Validate phone number format (should start with country code)
    if (!cleanPhone.match(/^55\d{10,11}$/)) {
      throw new Error("Invalid phone number format. Expected format: 5511999999999");
    }

    let payload;
    
    if (template && templateData) {
      // Send template message (for WhatsApp Business API)
      payload = {
        messaging_product: "whatsapp",
        to: cleanPhone,
        type: "template",
        template: {
          name: template,
          language: {
            code: "pt_BR"
          },
          components: [
            {
              type: "body",
              parameters: Object.values(templateData).map(value => ({
                type: "text",
                text: value
              }))
            }
          ]
        }
      };
    } else {
      // Send text message
      payload = {
        messaging_product: "whatsapp",
        to: cleanPhone,
        type: "text",
        text: {
          preview_url: true,
          body: message
        }
      };
    }

    console.log("Sending WhatsApp message to:", cleanPhone);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API Error:", responseData);
      throw new Error(responseData.error?.message || "Failed to send WhatsApp message");
    }

    console.log("WhatsApp message sent successfully:", responseData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: responseData.messages?.[0]?.id,
        data: responseData 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-whatsapp function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

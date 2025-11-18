import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { userId } = await req.json();

    if (!userId) {
      throw new Error('userId is required');
    }

    console.log(`📧 Sending welcome email for user: ${userId}`);

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, user_id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      console.error('❌ Error fetching profile:', profileError);
      throw new Error('Profile not found');
    }

    // Fetch user email from auth
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !user?.email) {
      console.error('❌ Error fetching user email:', userError);
      throw new Error('User email not found');
    }

    // Fetch user subscription and plan
    const { data: subscription, error: subError } = await supabase
      .from('partner_subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('partner_id', userId)
      .single();

    if (subError || !subscription) {
      console.error('❌ Error fetching subscription:', subError);
      throw new Error('Subscription not found');
    }

    const plan = subscription.plan as any;

    // Prepare welcome email data
    const emailData = {
      userName: profile.full_name || user.email.split('@')[0],
      planName: plan.name,
      planDisplayName: plan.display_name,
      planLimits: {
        clients: plan.max_clients,
        appointments: plan.max_appointments,
        serviceOrders: plan.max_service_orders,
        users: plan.max_users,
      },
      features: plan.features || [],
    };

    // Send welcome email via send-notification-email function
    const { error: emailError } = await supabase.functions.invoke(
      'send-notification-email',
      {
        body: {
          type: 'welcome',
          to: user.email,
          data: emailData,
        },
      }
    );

    if (emailError) {
      console.error('❌ Error sending welcome email:', emailError);
      throw emailError;
    }

    console.log(`✅ Welcome email sent successfully to ${user.email}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Welcome email sent successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Error in send-welcome-email:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

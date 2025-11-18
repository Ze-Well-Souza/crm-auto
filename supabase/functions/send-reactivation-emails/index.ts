import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InactiveClient {
  client_id: string;
  client_name: string;
  client_email: string;
  partner_id: string;
  last_appointment_date: string;
  last_service_type: string;
  days_since_last: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    console.log('📧 Starting reactivation email job...');

    // Calculate date 60 days ago
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const sixtyDaysAgoStr = sixtyDaysAgo.toISOString().split('T')[0];

    console.log(`📅 Searching for clients with last appointment before ${sixtyDaysAgoStr}`);

    // Query to find inactive clients:
    // 1. Clients with appointments
    // 2. Last appointment was more than 60 days ago
    // 3. Has email
    // 4. Haven't received reactivation email in the last 60 days
    const { data: inactiveClients, error: queryError } = await supabase.rpc(
      'get_inactive_clients',
      { days_threshold: 60 }
    );

    if (queryError) {
      // If RPC doesn't exist, fall back to manual query
      console.log('⚠️ RPC not found, using manual query');
      
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          client_id,
          scheduled_date,
          service_type,
          clients!inner(id, name, email, partner_id)
        `)
        .not('clients.email', 'is', null)
        .lte('scheduled_date', sixtyDaysAgoStr)
        .order('scheduled_date', { ascending: false });

      if (appointmentsError) {
        console.error('❌ Error fetching appointments:', appointmentsError);
        throw appointmentsError;
      }

      if (!appointments || appointments.length === 0) {
        console.log('✅ No inactive clients found');
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'No inactive clients found',
            count: 0 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Group by client_id and get most recent appointment per client
      const clientMap = new Map<string, any>();
      
      for (const apt of appointments as any[]) {
        const clientId = apt.client_id;
        if (!clientMap.has(clientId)) {
          const client = apt.clients;
          const appointmentDate = new Date(apt.scheduled_date);
          const today = new Date();
          const daysSince = Math.floor((today.getTime() - appointmentDate.getTime()) / (1000 * 60 * 60 * 24));
          
          clientMap.set(clientId, {
            client_id: clientId,
            client_name: client.name,
            client_email: client.email,
            partner_id: client.partner_id,
            last_appointment_date: apt.scheduled_date,
            last_service_type: apt.service_type,
            days_since_last: daysSince,
          });
        }
      }

      // Convert map to array and filter >= 60 days
      const processedClients = Array.from(clientMap.values()).filter(
        (client) => client.days_since_last >= 60
      );

      console.log(`📧 Found ${processedClients.length} inactive clients`);

      let sentCount = 0;
      let errorCount = 0;

      // Send reactivation emails
      for (const client of processedClients) {
        try {
          // Check if client already received reactivation email in last 60 days
          const { data: recentEmail } = await supabase
            .from('email_log')
            .select('id')
            .eq('recipient', client.client_email)
            .eq('template', 'reactivation')
            .gte('sent_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
            .limit(1);

          if (recentEmail && recentEmail.length > 0) {
            console.log(`⏭️ Client ${client.client_email} already received reactivation email recently`);
            continue;
          }

          // Get partner name
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', client.partner_id)
            .single();

          // Send reactivation email
          const { error: emailError } = await supabase.functions.invoke(
            'send-notification-email',
            {
              body: {
                type: 'reactivation',
                to: client.client_email,
                data: {
                  clientName: client.client_name,
                  daysSinceLastAppointment: client.days_since_last,
                  lastAppointmentDate: new Date(client.last_appointment_date).toLocaleDateString('pt-BR'),
                  lastServiceType: client.last_service_type,
                  partnerName: profile?.full_name || undefined,
                },
              },
            }
          );

          if (emailError) {
            console.error(`❌ Error sending email to ${client.client_email}:`, emailError);
            errorCount++;
            continue;
          }

          console.log(`✅ Reactivation email sent to ${client.client_email}`);
          sentCount++;

        } catch (error) {
          console.error(`❌ Error processing client ${client.client_id}:`, error);
          errorCount++;
        }
      }

      const result = {
        success: true,
        message: `Processed ${processedClients.length} inactive clients`,
        sent: sentCount,
        errors: errorCount,
      };

      console.log('🎉 Reactivation job completed:', result);

      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If RPC exists and worked, process results
    console.log(`📧 Found ${inactiveClients?.length || 0} inactive clients via RPC`);
    
    let sentCount = 0;
    let errorCount = 0;

    for (const client of (inactiveClients as InactiveClient[]) || []) {
      try {
        // Check if already sent recently
        const { data: recentEmail } = await supabase
          .from('email_log')
          .select('id')
          .eq('recipient', client.client_email)
          .eq('template', 'reactivation')
          .gte('sent_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
          .limit(1);

        if (recentEmail && recentEmail.length > 0) {
          console.log(`⏭️ Client ${client.client_email} already received reactivation email recently`);
          continue;
        }

        // Get partner name
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', client.partner_id)
          .single();

        // Send email
        const { error: emailError } = await supabase.functions.invoke(
          'send-notification-email',
          {
            body: {
              type: 'reactivation',
              to: client.client_email,
              data: {
                clientName: client.client_name,
                daysSinceLastAppointment: client.days_since_last,
                lastAppointmentDate: new Date(client.last_appointment_date).toLocaleDateString('pt-BR'),
                lastServiceType: client.last_service_type,
                partnerName: profile?.full_name || undefined,
              },
            },
          }
        );

        if (emailError) {
          console.error(`❌ Error sending email to ${client.client_email}:`, emailError);
          errorCount++;
          continue;
        }

        console.log(`✅ Reactivation email sent to ${client.client_email}`);
        sentCount++;

      } catch (error) {
        console.error(`❌ Error processing client ${client.client_id}:`, error);
        errorCount++;
      }
    }

    const result = {
      success: true,
      message: `Processed ${inactiveClients?.length || 0} inactive clients`,
      sent: sentCount,
      errors: errorCount,
    };

    console.log('🎉 Reactivation job completed:', result);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Reactivation job failed:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

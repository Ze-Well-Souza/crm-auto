import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Appointment {
  id: string;
  client_id: string;
  scheduled_date: string;
  scheduled_time: string;
  service_type: string;
  description: string;
  estimated_price: number;
  vehicle_id: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
}

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  plate: string;
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
    console.log('🔔 Starting appointment reminder job...');

    // Calculate tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    console.log(`📅 Searching for appointments on ${tomorrowDate}`);

    // Fetch appointments for tomorrow that haven't received reminders
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .eq('scheduled_date', tomorrowDate)
      .eq('reminder_sent', false)
      .in('status', ['pending', 'confirmed']);

    if (appointmentsError) {
      console.error('❌ Error fetching appointments:', appointmentsError);
      throw appointmentsError;
    }

    if (!appointments || appointments.length === 0) {
      console.log('✅ No appointments found for tomorrow');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No appointments to remind',
          count: 0 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📧 Found ${appointments.length} appointments to send reminders`);

    let sentCount = 0;
    let errorCount = 0;

    // Process each appointment
    for (const appointment of appointments as Appointment[]) {
      try {
        // Fetch client details
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .select('id, name, email')
          .eq('id', appointment.client_id)
          .single();

        if (clientError || !client || !client.email) {
          console.log(`⚠️ Client ${appointment.client_id} not found or has no email`);
          continue;
        }

        // Fetch vehicle details if exists
        let vehicleInfo = '';
        if (appointment.vehicle_id) {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select('brand, model, plate')
            .eq('id', appointment.vehicle_id)
            .single();

          if (vehicle) {
            vehicleInfo = `${vehicle.brand} ${vehicle.model}${vehicle.plate ? ` - ${vehicle.plate}` : ''}`;
          }
        }

        // Send reminder email
        const { error: emailError } = await supabase.functions.invoke(
          'send-notification-email',
          {
            body: {
              type: 'appointment_reminder',
              to: client.email,
              data: {
                clientName: client.name,
                appointmentDate: new Date(appointment.scheduled_date).toLocaleDateString('pt-BR'),
                appointmentTime: appointment.scheduled_time,
                serviceType: appointment.service_type || appointment.description || 'Serviço agendado',
                vehicleInfo: vehicleInfo || undefined,
                estimatedPrice: appointment.estimated_price || undefined,
              },
            },
          }
        );

        if (emailError) {
          console.error(`❌ Error sending email to ${client.email}:`, emailError);
          errorCount++;
          continue;
        }

        // Mark reminder as sent
        const { error: updateError } = await supabase
          .from('appointments')
          .update({ reminder_sent: true })
          .eq('id', appointment.id);

        if (updateError) {
          console.error(`⚠️ Error updating reminder_sent for appointment ${appointment.id}:`, updateError);
        }

        console.log(`✅ Reminder sent to ${client.email} for appointment ${appointment.id}`);
        sentCount++;

      } catch (error) {
        console.error(`❌ Error processing appointment ${appointment.id}:`, error);
        errorCount++;
      }
    }

    const result = {
      success: true,
      message: `Processed ${appointments.length} appointments`,
      sent: sentCount,
      errors: errorCount,
      date: tomorrowDate,
    };

    console.log('🎉 Reminder job completed:', result);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ Reminder job failed:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

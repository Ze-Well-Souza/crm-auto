import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StripeWebhookEvent {
  id: string;
  event_id: string;
  event_type: string;
  event_data: any;
  status: 'pending' | 'succeeded' | 'failed';
  attempts: number;
  error_message?: string;
  next_retry_at?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export const useStripeWebhooks = () => {
  const [events, setEvents] = useState<StripeWebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWebhookEvents();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('stripe_webhook_events_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'stripe_webhook_events'
      }, () => {
        fetchWebhookEvents();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchWebhookEvents = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('stripe_webhook_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      setEvents(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching webhook events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    error,
    refetch: fetchWebhookEvents
  };
};

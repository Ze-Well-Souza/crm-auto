import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Registra visitas e interações no CRM para analytics.
 * Armazena dados na tabela crm_analytics do Supabase.
 * Fallback para localStorage quando offline ou sem auth.
 */

interface AnalyticsEvent {
  event: string;
  page?: string;
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'crm_analytics_queue';

// Fila local para quando não tem conexão
function getQueue(): AnalyticsEvent[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function addToQueue(event: AnalyticsEvent) {
  const queue = getQueue();
  queue.push({ ...event, metadata: { ...event.metadata, queued_at: new Date().toISOString() } });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue.slice(-100))); // max 100 events
}

async function flushQueue() {
  const queue = getQueue();
  if (queue.length === 0) return;

  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id || 'anonymous';

  const rows = queue.map(e => ({
    user_id: userId,
    event: e.event,
    page: e.page || window.location.pathname,
    metadata: e.metadata || {},
    created_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('crm_analytics').insert(rows);
  if (!error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Track a single analytics event
 */
export async function trackEvent(event: string, page?: string, metadata?: Record<string, any>) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || 'anonymous';

    const { error } = await supabase.from('crm_analytics').insert({
      user_id: userId,
      event,
      page: page || window.location.pathname,
      metadata: metadata || {},
    });

    if (error) {
      // Queue for later
      addToQueue({ event, page, metadata });
    }
  } catch {
    addToQueue({ event, page, metadata });
  }
}

/**
 * Hook que expõe a função trackEvent e tenta realizar o flush pendente.
 */
export function useAnalytics() {
  useEffect(() => {
    // Flush queued events
    flushQueue();
  }, []);

  return { trackEvent };
}

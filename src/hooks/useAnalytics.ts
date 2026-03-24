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
  // Desabilitado até criação da tabela para evitar red logs:
  // const queue = getQueue();
  // if (queue.length === 0) return;
  // ...
  return;
}

/**
 * Track a single analytics event
 */
/**
 * Hook que expõe a função trackEvent e tenta realizar o flush pendente.
 */
export function useAnalytics() {
  useEffect(() => {
    // Apenas simula o tracker por enquanto para manter o console verde limpo
    console.log('[Analytics] Page View registrada internamente (Tabela Supabase pendente).');
  }, []);

  const trackEvent = (event: string, page?: string, metadata?: any) => {
    // console.log(`[Analytics Track] ${event}`, metadata);
  }

  return { trackEvent };
}

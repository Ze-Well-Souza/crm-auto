import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';

/**
 * Componente invisível que gerencia o registro automático
 * de page views em todas as rotas da aplicação.
 * Deve ser colocado dentro do BrowserRouter no App.tsx.
 */
export function AnalyticsTracker() {
  const { pathname } = useLocation();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('page_view', pathname, {
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      screen: `${window.screen.width}x${window.screen.height}`,
      timestamp: new Date().toISOString(),
    });
  }, [pathname, trackEvent]);

  return null;
}


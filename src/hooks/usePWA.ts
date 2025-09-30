import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  isLoading: boolean;
}

interface PWAActions {
  installApp: () => Promise<void>;
  updateApp: () => Promise<void>;
  checkForUpdates: () => Promise<void>;
  skipWaiting: () => void;
}

export const usePWA = (): PWAState & PWAActions => {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    isUpdateAvailable: false,
    isLoading: false
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Verificar se o app está instalado
  const checkIfInstalled = useCallback(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isInstalled = isStandalone || isInWebAppiOS;
    
    setState(prev => ({ ...prev, isInstalled }));
  }, []);

  // Registrar Service Worker
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        setRegistration(reg);

        // Verificar se há uma atualização aguardando
        if (reg.waiting) {
          setState(prev => ({ ...prev, isUpdateAvailable: true }));
        }

        // Escutar por atualizações
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, isUpdateAvailable: true }));
              }
            });
          }
        });

        console.log('Service Worker registrado com sucesso');
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error);
      }
    }
  }, []);

  // Instalar o app
  const installApp = useCallback(async () => {
    if (!deferredPrompt) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA instalado pelo usuário');
        setState(prev => ({ 
          ...prev, 
          isInstallable: false, 
          isInstalled: true 
        }));
      } else {
        console.log('Instalação do PWA rejeitada pelo usuário');
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [deferredPrompt]);

  // Atualizar o app
  const updateApp = useCallback(async () => {
    if (!registration || !registration.waiting) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Enviar mensagem para o service worker para pular a espera
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Aguardar o novo service worker assumir o controle
      await new Promise<void>((resolve) => {
        const handleControllerChange = () => {
          navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
          resolve();
        };
        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
      });

      // Recarregar a página para aplicar a atualização
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar PWA:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [registration]);

  // Verificar por atualizações
  const checkForUpdates = useCallback(async () => {
    if (!registration) return;

    try {
      await registration.update();
      console.log('Verificação de atualização concluída');
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
    }
  }, [registration]);

  // Pular espera do service worker
  const skipWaiting = useCallback(() => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [registration]);

  // Efeitos
  useEffect(() => {
    // Verificar se está instalado
    checkIfInstalled();

    // Registrar service worker
    registerServiceWorker();

    // Escutar evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setState(prev => ({ ...prev, isInstallable: true }));
    };

    // Escutar mudanças na conexão
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    // Escutar mudanças no display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => checkIfInstalled();

    // Adicionar event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, [checkIfInstalled, registerServiceWorker]);

  // Verificar atualizações periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      checkForUpdates();
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, [checkForUpdates]);

  return {
    ...state,
    installApp,
    updateApp,
    checkForUpdates,
    skipWaiting
  };
};

// Hook para gerenciar dados offline
export const useOfflineData = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingSync, setPendingSync] = useState<any[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Tentar sincronizar dados pendentes
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration) => {
          return registration.sync.register('sync-offline-data');
        });
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addToPendingSync = useCallback((data: any) => {
    setPendingSync(prev => [...prev, { ...data, id: Date.now() }]);
  }, []);

  const removePendingSync = useCallback((id: number) => {
    setPendingSync(prev => prev.filter(item => item.id !== id));
  }, []);

  return {
    isOffline,
    pendingSync,
    addToPendingSync,
    removePendingSync
  };
};

// Hook para notificações push
export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      throw new Error('Este navegador não suporta notificações');
    }

    const permission = await Notification.requestPermission();
    setPermission(permission);

    if (permission === 'granted' && 'serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });
      setSubscription(subscription);
    }

    return permission;
  }, []);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, options);
    }
  }, [permission]);

  return {
    permission,
    subscription,
    requestPermission,
    sendNotification
  };
};
import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

interface OfflineData {
  id: string;
  type: 'appointment' | 'client' | 'vehicle' | 'financial' | 'inventory';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  synced: boolean;
}

interface OfflineStorageState {
  isOffline: boolean;
  pendingSync: OfflineData[];
  isSyncing: boolean;
  lastSyncTime: number | null;
}

const STORAGE_KEY = 'crm-offline-data';
const LAST_SYNC_KEY = 'crm-last-sync';

export const useOfflineStorage = () => {
  const { showSuccess, showError, showInfo } = useNotifications();
  
  const [state, setState] = useState<OfflineStorageState>({
    isOffline: !navigator.onLine,
    pendingSync: [],
    isSyncing: false,
    lastSyncTime: null
  });

  // Carregar dados do localStorage
  const loadOfflineData = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const lastSync = localStorage.getItem(LAST_SYNC_KEY);
      
      if (stored) {
        const pendingSync = JSON.parse(stored);
        setState(prev => ({
          ...prev,
          pendingSync,
          lastSyncTime: lastSync ? parseInt(lastSync) : null
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar dados offline:', error);
    }
  }, []);

  // Salvar dados no localStorage
  const saveOfflineData = useCallback((data: OfflineData[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados offline:', error);
    }
  }, []);

  // Adicionar item para sincronização
  const addToOfflineQueue = useCallback((item: Omit<OfflineData, 'id' | 'timestamp' | 'synced'>) => {
    const newItem: OfflineData = {
      ...item,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      synced: false
    };

    setState(prev => {
      const updated = [...prev.pendingSync, newItem];
      saveOfflineData(updated);
      return { ...prev, pendingSync: updated };
    });

    showInfo('Dados salvos offline');
    return newItem.id;
  }, [saveOfflineData, showInfo]);

  // Sincronizar dados pendentes
  const syncPendingData = useCallback(async () => {
    if (state.isSyncing || state.isOffline || state.pendingSync.length === 0) {
      return;
    }

    setState(prev => ({ ...prev, isSyncing: true }));

    try {
      const unsyncedItems = state.pendingSync.filter(item => !item.synced);
      
      for (const item of unsyncedItems) {
        try {
          // Simular sincronização
          await new Promise(resolve => setTimeout(resolve, 500));
          console.log(`Sincronizando ${item.action} ${item.type}:`, item.data);
        } catch (error) {
          console.error(`Erro ao sincronizar item ${item.id}:`, error);
        }
      }

      const syncTime = Date.now();
      localStorage.setItem(LAST_SYNC_KEY, syncTime.toString());
      setState(prev => ({ 
        ...prev, 
        lastSyncTime: syncTime,
        pendingSync: []
      }));
      localStorage.removeItem(STORAGE_KEY);

      if (unsyncedItems.length > 0) {
        showSuccess(`Sincronização concluída: ${unsyncedItems.length} item(s)`);
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
      showError('Erro na sincronização');
    } finally {
      setState(prev => ({ ...prev, isSyncing: false }));
    }
  }, [state.isSyncing, state.isOffline, state.pendingSync, showSuccess, showError]);

  // Efeitos
  useEffect(() => {
    loadOfflineData();
  }, [loadOfflineData]);

  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOffline: false }));
      setTimeout(syncPendingData, 1000);
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOffline: true }));
      showInfo('Modo offline ativado');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncPendingData, showInfo]);

  return {
    ...state,
    addToOfflineQueue,
    syncPendingData
  };
};
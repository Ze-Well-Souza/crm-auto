import React, { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface NotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: React.ReactElement;
  persistent?: boolean;
}

export interface NotificationContextType {
  // Basic notifications
  showSuccess: (message: string, options?: NotificationOptions) => void;
  showError: (message: string, options?: NotificationOptions) => void;
  showWarning: (message: string, options?: NotificationOptions) => void;
  showInfo: (message: string, options?: NotificationOptions) => void;
  
  // Business-specific notifications
  showOperationSuccess: (operation: string, entity?: string) => void;
  showOperationError: (operation: string, entity?: string, error?: string) => void;
  showValidationError: (field: string, message: string) => void;
  showConnectionError: () => void;
  showSaveSuccess: (entity: string) => void;
  showDeleteSuccess: (entity: string) => void;
  showUpdateSuccess: (entity: string) => void;
  showCreateSuccess: (entity: string) => void;
  
  // System notifications
  showSystemAlert: (message: string, type?: 'maintenance' | 'update' | 'security') => void;
  showPerformanceAlert: (message: string) => void;
  showDataSyncAlert: (status: 'syncing' | 'synced' | 'error') => void;
  
  // WhatsApp notifications
  showWhatsAppSuccess: (message: string) => void;
  showWhatsAppError: (message: string) => void;
  showWhatsAppConfigAlert: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { toast } = useToast();

  const showSuccess = useCallback((message: string, options?: NotificationOptions) => {
    toast({
      title: options?.title || "Sucesso",
      description: message,
      duration: options?.duration || 3000,
      action: options?.action,
      className: "border-green-500 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100",
    });
  }, [toast]);

  const showError = useCallback((message: string, options?: NotificationOptions) => {
    toast({
      title: options?.title || "Erro",
      description: message,
      duration: options?.duration || 5000,
      action: options?.action,
      className: "border-red-500 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100",
    });
  }, [toast]);

  const showWarning = useCallback((message: string, options?: NotificationOptions) => {
    toast({
      title: options?.title || "Atenção",
      description: message,
      duration: options?.duration || 4000,
      action: options?.action,
      className: "border-orange-500 bg-orange-50 dark:bg-orange-950 text-orange-900 dark:text-orange-100",
    });
  }, [toast]);

  const showInfo = useCallback((message: string, options?: NotificationOptions) => {
    toast({
      title: options?.title || "Informação",
      description: message,
      duration: options?.duration || 3000,
      action: options?.action,
      className: "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100",
    });
  }, [toast]);

  // Business-specific notifications
  const showOperationSuccess = useCallback((operation: string, entity?: string) => {
    const entityText = entity ? ` ${entity}` : '';
    showSuccess(`${operation}${entityText} realizada com sucesso!`);
  }, [showSuccess]);

  const showOperationError = useCallback((operation: string, entity?: string, error?: string) => {
    const entityText = entity ? ` ${entity}` : '';
    const errorText = error ? `: ${error}` : '';
    showError(`Erro ao ${operation.toLowerCase()}${entityText}${errorText}`);
  }, [showError]);

  const showValidationError = useCallback((field: string, message: string) => {
    showError(`${field}: ${message}`, {
      title: "Erro de Validação"
    });
  }, [showError]);

  const showConnectionError = useCallback(() => {
    showError("Erro de conexão. Verifique sua internet e tente novamente.", {
      title: "Conexão Perdida",
      duration: 6000
    });
  }, [showError]);

  const showSaveSuccess = useCallback((entity: string) => {
    showSuccess(`${entity} salvo com sucesso!`);
  }, [showSuccess]);

  const showDeleteSuccess = useCallback((entity: string) => {
    showSuccess(`${entity} excluído com sucesso!`);
  }, [showSuccess]);

  const showUpdateSuccess = useCallback((entity: string) => {
    showSuccess(`${entity} atualizado com sucesso!`);
  }, [showSuccess]);

  const showCreateSuccess = useCallback((entity: string) => {
    showSuccess(`${entity} criado com sucesso!`);
  }, [showSuccess]);

  // System notifications
  const showSystemAlert = useCallback((message: string, type: 'maintenance' | 'update' | 'security' = 'update') => {
    const titles = {
      maintenance: 'Manutenção do Sistema',
      update: 'Atualização Disponível',
      security: 'Alerta de Segurança'
    };

    const durations = {
      maintenance: 8000,
      update: 6000,
      security: 10000
    };

    showWarning(message, {
      title: titles[type],
      duration: durations[type],
      persistent: type === 'security'
    });
  }, [showWarning]);

  const showPerformanceAlert = useCallback((message: string) => {
    showInfo(message, {
      title: "Performance",
      duration: 4000
    });
  }, [showInfo]);

  const showDataSyncAlert = useCallback((status: 'syncing' | 'synced' | 'error') => {
    const messages = {
      syncing: 'Sincronizando dados...',
      synced: 'Dados sincronizados com sucesso!',
      error: 'Erro na sincronização de dados'
    };

    if (status === 'syncing') {
      showInfo(messages[status], { title: "Sincronização", duration: 2000 });
    } else if (status === 'synced') {
      showSuccess(messages[status], { title: "Sincronização", duration: 3000 });
    } else {
      showError(messages[status], { title: "Sincronização", duration: 3000 });
    }
  }, [showInfo, showSuccess, showError]);

  // WhatsApp notifications
  const showWhatsAppSuccess = useCallback((message: string) => {
    showSuccess(message, {
      title: "WhatsApp",
      duration: 4000
    });
  }, [showSuccess]);

  const showWhatsAppError = useCallback((message: string) => {
    showError(message, {
      title: "Erro no WhatsApp",
      duration: 5000
    });
  }, [showError]);

  const showWhatsAppConfigAlert = useCallback(() => {
    showWarning("Configure o número e token do WhatsApp Business para ativar as notificações.", {
      title: "Configuração Necessária",
      duration: 6000
    });
  }, [showWarning]);

  const value: NotificationContextType = useMemo(() => ({
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showOperationSuccess,
    showOperationError,
    showValidationError,
    showConnectionError,
    showSaveSuccess,
    showDeleteSuccess,
    showUpdateSuccess,
    showCreateSuccess,
    showSystemAlert,
    showPerformanceAlert,
    showDataSyncAlert,
    showWhatsAppSuccess,
    showWhatsAppError,
    showWhatsAppConfigAlert,
  }), [
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showOperationSuccess,
    showOperationError,
    showValidationError,
    showConnectionError,
    showSaveSuccess,
    showDeleteSuccess,
    showUpdateSuccess,
    showCreateSuccess,
    showSystemAlert,
    showPerformanceAlert,
    showDataSyncAlert,
    showWhatsAppSuccess,
    showWhatsAppError,
    showWhatsAppConfigAlert,
  ]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Alias para compatibilidade (caso alguém esteja usando o nome singular)
export const useNotification = useNotifications;

// Utility functions for common patterns
export const withNotifications = <T extends any[]>(
  fn: (...args: T) => Promise<any>,
  successMessage: string,
  errorMessage: string,
  notifications: NotificationContextType
) => {
  return async (...args: T) => {
    try {
      const result = await fn(...args);
      notifications.showSuccess(successMessage);
      return result;
    } catch (error) {
      notifications.showError(`${errorMessage}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      throw error;
    }
  };
};

// Hook for CRUD operations with automatic notifications
export const useCrudNotifications = () => {
  const notifications = useNotifications();

  return {
    notifyCreate: (entity: string) => notifications.showCreateSuccess(entity),
    notifyUpdate: (entity: string) => notifications.showUpdateSuccess(entity),
    notifyDelete: (entity: string) => notifications.showDeleteSuccess(entity),
    notifyError: (operation: string, entity: string, error?: string) => 
      notifications.showOperationError(operation, entity, error),
    notifyValidation: (field: string, message: string) => 
      notifications.showValidationError(field, message),
  };
};
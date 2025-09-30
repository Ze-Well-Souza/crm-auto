import React, { createContext, useContext, ReactNode } from 'react';
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
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { toast } = useToast();

  const showSuccess = (message: string, options?: NotificationOptions) => {
    toast({
      title: options?.title || "Sucesso",
      description: message,
      duration: options?.duration || 3000,
      action: options?.action,
      className: "border-green-500 bg-green-50 text-green-900",
    });
  };

  const showError = (message: string, options?: NotificationOptions) => {
    toast({
      title: options?.title || "Erro",
      description: message,
      duration: options?.duration || 5000,
      action: options?.action,
      className: "border-red-500 bg-red-50 text-red-900",
    });
  };

  const showWarning = (message: string, options?: NotificationOptions) => {
    toast({
      title: options?.title || "Atenção",
      description: message,
      duration: options?.duration || 4000,
      action: options?.action,
      className: "border-yellow-500 bg-yellow-50 text-yellow-900",
    });
  };

  const showInfo = (message: string, options?: NotificationOptions) => {
    toast({
      title: options?.title || "Informação",
      description: message,
      duration: options?.duration || 3000,
      action: options?.action,
      className: "border-blue-500 bg-blue-50 text-blue-900",
    });
  };

  // Business-specific notifications
  const showOperationSuccess = (operation: string, entity?: string) => {
    const entityText = entity ? ` ${entity}` : '';
    showSuccess(`${operation}${entityText} realizada com sucesso!`);
  };

  const showOperationError = (operation: string, entity?: string, error?: string) => {
    const entityText = entity ? ` ${entity}` : '';
    const errorText = error ? `: ${error}` : '';
    showError(`Erro ao ${operation.toLowerCase()}${entityText}${errorText}`);
  };

  const showValidationError = (field: string, message: string) => {
    showError(`${field}: ${message}`, {
      title: "Erro de Validação"
    });
  };

  const showConnectionError = () => {
    showError("Erro de conexão. Verifique sua internet e tente novamente.", {
      title: "Conexão Perdida",
      duration: 6000
    });
  };

  const showSaveSuccess = (entity: string) => {
    showSuccess(`${entity} salvo com sucesso!`);
  };

  const showDeleteSuccess = (entity: string) => {
    showSuccess(`${entity} excluído com sucesso!`);
  };

  const showUpdateSuccess = (entity: string) => {
    showSuccess(`${entity} atualizado com sucesso!`);
  };

  const showCreateSuccess = (entity: string) => {
    showSuccess(`${entity} criado com sucesso!`);
  };

  // System notifications
  const showSystemAlert = (message: string, type: 'maintenance' | 'update' | 'security' = 'update') => {
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
  };

  const showPerformanceAlert = (message: string) => {
    showInfo(message, {
      title: "Performance",
      duration: 4000
    });
  };

  const showDataSyncAlert = (status: 'syncing' | 'synced' | 'error') => {
    const messages = {
      syncing: 'Sincronizando dados...',
      synced: 'Dados sincronizados com sucesso!',
      error: 'Erro na sincronização de dados'
    };

    const types = {
      syncing: showInfo,
      synced: showSuccess,
      error: showError
    };

    types[status](messages[status], {
      title: "Sincronização",
      duration: status === 'syncing' ? 2000 : 3000
    });
  };

  const value: NotificationContextType = {
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
  };

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
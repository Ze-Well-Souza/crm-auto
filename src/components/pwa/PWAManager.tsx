import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePWA, useOfflineData, usePushNotifications } from "@/hooks/usePWA";
import { useNotifications } from "@/contexts/NotificationContext";
import { 
  Smartphone, 
  Download, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Bell, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Info,
  Zap,
  Cloud,
  CloudOff
} from "lucide-react";

interface PWAManagerProps {
  className?: string;
}

export const PWAManager: React.FC<PWAManagerProps> = ({ 
  className = "" 
}) => {
  const { showSuccess, showError, showInfo, showWarning } = useNotifications();
  const {
    isInstallable,
    isInstalled,
    isOnline,
    isUpdateAvailable,
    isLoading,
    installApp,
    updateApp,
    checkForUpdates
  } = usePWA();

  const {
    isOffline,
    pendingSync,
    addToPendingSync
  } = useOfflineData();

  const {
    permission,
    requestPermission,
    sendNotification
  } = usePushNotifications();

  const [autoUpdate, setAutoUpdate] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);

  const handleInstall = async () => {
    try {
      await installApp();
      showSuccess('CRM Parceiro foi instalado com sucesso!', {
        title: 'App Instalado'
      });
    } catch (error) {
      showError('Não foi possível instalar o app. Tente novamente.', {
        title: 'Erro na Instalação'
      });
    }
  };

  const handleUpdate = async () => {
    try {
      await updateApp();
      showSuccess('CRM Parceiro foi atualizado para a versão mais recente!', {
        title: 'App Atualizado'
      });
    } catch (error) {
      showError('Não foi possível atualizar o app. Tente novamente.', {
        title: 'Erro na Atualização'
      });
    }
  };

  const handleCheckUpdates = async () => {
    try {
      await checkForUpdates();
      showInfo('Verificação de atualizações realizada com sucesso.', {
        title: 'Verificação Concluída'
      });
    } catch (error) {
      showError('Não foi possível verificar atualizações.', {
        title: 'Erro na Verificação'
      });
    }
  };

  const handleNotificationPermission = async () => {
    try {
      const permission = await requestPermission();
      if (permission === 'granted') {
        showSuccess('Você receberá notificações do CRM Parceiro.', {
          title: 'Notificações Habilitadas'
        });
        sendNotification('CRM Parceiro', {
          body: 'Notificações habilitadas com sucesso!',
          icon: '/favicon.ico'
        });
      } else {
        showWarning('Para receber notificações, permita o acesso nas configurações.', {
          title: 'Permissão Negada'
        });
      }
    } catch (error) {
      showError('Erro ao solicitar permissão para notificações.', {
        title: 'Erro'
      });
    }
  };

  const getConnectionStatus = () => {
    if (isOnline) {
      return {
        icon: <Wifi className="w-4 h-4 text-green-600" />,
        text: 'Online',
        color: 'bg-green-100 text-green-800'
      };
    } else {
      return {
        icon: <WifiOff className="w-4 h-4 text-red-600" />,
        text: 'Offline',
        color: 'bg-red-100 text-red-800'
      };
    }
  };

  const getInstallStatus = () => {
    if (isInstalled) {
      return {
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
        text: 'Instalado',
        color: 'bg-green-100 text-green-800'
      };
    } else if (isInstallable) {
      return {
        icon: <Download className="w-4 h-4 text-blue-600" />,
        text: 'Disponível',
        color: 'bg-blue-100 text-blue-800'
      };
    } else {
      return {
        icon: <Info className="w-4 h-4 text-gray-600" />,
        text: 'Não Disponível',
        color: 'bg-gray-100 text-gray-800'
      };
    }
  };

  const getNotificationStatus = () => {
    switch (permission) {
      case 'granted':
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          text: 'Permitido',
          color: 'bg-green-100 text-green-800'
        };
      case 'denied':
        return {
          icon: <AlertCircle className="w-4 h-4 text-red-600" />,
          text: 'Negado',
          color: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: <Bell className="w-4 h-4 text-yellow-600" />,
          text: 'Pendente',
          color: 'bg-yellow-100 text-yellow-800'
        };
    }
  };

  const connectionStatus = getConnectionStatus();
  const installStatus = getInstallStatus();
  const notificationStatus = getNotificationStatus();

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            Gerenciador PWA
          </CardTitle>
          <CardDescription>
            Configure e gerencie as funcionalidades do Progressive Web App
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Geral */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {connectionStatus.icon}
                <span className="font-medium text-sm">Conexão</span>
              </div>
              <Badge className={connectionStatus.color}>
                {connectionStatus.text}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {installStatus.icon}
                <span className="font-medium text-sm">Instalação</span>
              </div>
              <Badge className={installStatus.color}>
                {installStatus.text}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {notificationStatus.icon}
                <span className="font-medium text-sm">Notificações</span>
              </div>
              <Badge className={notificationStatus.color}>
                {notificationStatus.text}
              </Badge>
            </div>
          </div>

          {/* Alertas */}
          {isUpdateAvailable && (
            <Alert>
              <RefreshCw className="h-4 w-4" />
              <AlertDescription>
                Uma nova versão do app está disponível. 
                <Button 
                  variant="link" 
                  className="p-0 h-auto ml-1"
                  onClick={handleUpdate}
                  disabled={isLoading}
                >
                  Atualizar agora
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {isOffline && (
            <Alert>
              <CloudOff className="h-4 w-4" />
              <AlertDescription>
                Você está offline. Algumas funcionalidades podem estar limitadas.
                {pendingSync.length > 0 && (
                  <span className="ml-1">
                    {pendingSync.length} item(s) aguardando sincronização.
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          {/* Instalação */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Instalação do App</h3>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Instalar CRM Parceiro</Label>
                <p className="text-sm text-gray-600">
                  Instale o app para acesso rápido e funcionalidades offline
                </p>
              </div>
              {isInstallable && !isInstalled && (
                <Button 
                  onClick={handleInstall}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Instalar
                </Button>
              )}
              {isInstalled && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Instalado
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Atualizações */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Atualizações</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Atualizações Automáticas</Label>
                <p className="text-sm text-gray-600">
                  Baixar e instalar atualizações automaticamente
                </p>
              </div>
              <Switch
                checked={autoUpdate}
                onCheckedChange={setAutoUpdate}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Verificar Atualizações</Label>
                <p className="text-sm text-gray-600">
                  Verificar manualmente por novas versões
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={handleCheckUpdates}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Verificar
              </Button>
            </div>

            {isUpdateAvailable && (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Atualização Disponível</span>
                </div>
                <Button 
                  onClick={handleUpdate}
                  disabled={isLoading}
                  size="sm"
                >
                  Atualizar
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Modo Offline */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Modo Offline</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Habilitar Modo Offline</Label>
                <p className="text-sm text-gray-600">
                  Permitir uso do app sem conexão com internet
                </p>
              </div>
              <Switch
                checked={offlineMode}
                onCheckedChange={setOfflineMode}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-sm">Cache de Dados</span>
                </div>
                <p className="text-xs text-gray-600">
                  Dados salvos localmente para acesso offline
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-sm">Sincronização</span>
                </div>
                <p className="text-xs text-gray-600">
                  {pendingSync.length} item(s) aguardando sincronização
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notificações */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notificações Push</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Habilitar Notificações</Label>
                <p className="text-sm text-gray-600">
                  Receber notificações sobre atualizações e eventos importantes
                </p>
              </div>
              {permission !== 'granted' && (
                <Button 
                  onClick={handleNotificationPermission}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Permitir
                </Button>
              )}
              {permission === 'granted' && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Habilitado
                </Badge>
              )}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {isInstalled ? '100%' : '0%'}
              </div>
              <div className="text-sm text-blue-700">App Instalado</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {isOnline ? '100%' : '0%'}
              </div>
              <div className="text-sm text-green-700">Conectividade</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {permission === 'granted' ? '100%' : '0%'}
              </div>
              <div className="text-sm text-purple-700">Notificações</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
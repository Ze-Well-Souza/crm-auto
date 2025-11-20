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
          icon: <Bell className="w-4 h-4 text-orange-400" />,
          text: 'Pendente',
          color: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
        };
    }
  };

  const connectionStatus = getConnectionStatus();
  const installStatus = getInstallStatus();
  const notificationStatus = getNotificationStatus();

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Smartphone className="w-5 h-5 text-blue-400" />
            </div>
            Gerenciador PWA
          </CardTitle>
          <CardDescription className="text-slate-400">
            Configure e gerencie as funcionalidades do Progressive Web App
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Geral */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                {connectionStatus.icon}
                <span className="font-medium text-sm text-white">Conexão</span>
              </div>
              <Badge className={connectionStatus.color}>
                {connectionStatus.text}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                {installStatus.icon}
                <span className="font-medium text-sm text-white">Instalação</span>
              </div>
              <Badge className={installStatus.color}>
                {installStatus.text}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                {notificationStatus.icon}
                <span className="font-medium text-sm text-white">Notificações</span>
              </div>
              <Badge className={notificationStatus.color}>
                {notificationStatus.text}
              </Badge>
            </div>
          </div>

          {/* Alertas */}
          {isUpdateAvailable && (
            <Alert className="bg-orange-500/20 border-orange-500/30">
              <RefreshCw className="h-4 w-4 text-orange-400" />
              <AlertDescription className="text-orange-300">
                Uma nova versão do app está disponível.
                <Button
                  variant="link"
                  className="p-0 h-auto ml-1 text-orange-200 hover:text-orange-100"
                  onClick={handleUpdate}
                  disabled={isLoading}
                >
                  Atualizar agora
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {isOffline && (
            <Alert className="bg-orange-500/20 border-orange-500/30">
              <CloudOff className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-yellow-400">
                Você está offline. Algumas funcionalidades podem estar limitadas.
                {pendingSync.length > 0 && (
                  <span className="ml-1">
                    {pendingSync.length} item(s) aguardando sincronização.
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Separator className="bg-white/10" />

          {/* Instalação */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-400">Instalação do App</h3>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-white">Instalar CRM Parceiro</Label>
                <p className="text-sm text-slate-400">
                  Instale o app para acesso rápido e funcionalidades offline
                </p>
              </div>
              {isInstallable && !isInstalled && (
                <Button
                  onClick={handleInstall}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                >
                  <Download className="w-4 h-4" />
                  Instalar
                </Button>
              )}
              {isInstalled && (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Instalado
                </Badge>
              )}
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Atualizações */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-400">Atualizações</h3>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-white">Atualizações Automáticas</Label>
                <p className="text-sm text-slate-400">
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
                <Label className="font-medium text-white">Verificar Atualizações</Label>
                <p className="text-sm text-slate-400">
                  Verificar manualmente por novas versões
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleCheckUpdates}
                disabled={isLoading}
                className="flex items-center gap-2 border-white/10 text-white hover:bg-white/10"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Verificar
              </Button>
            </div>

            {isUpdateAvailable && (
              <div className="flex items-center justify-between p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-blue-300">Atualização Disponível</span>
                </div>
                <Button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                >
                  Atualizar
                </Button>
              </div>
            )}
          </div>

          <Separator className="bg-white/10" />

          {/* Modo Offline */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-400">Modo Offline</h3>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-white">Habilitar Modo Offline</Label>
                <p className="text-sm text-slate-400">
                  Permitir uso do app sem conexão com internet
                </p>
              </div>
              <Switch
                checked={offlineMode}
                onCheckedChange={setOfflineMode}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-sm text-white">Cache de Dados</span>
                </div>
                <p className="text-xs text-slate-400">
                  Dados salvos localmente para acesso offline
                </p>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-sm text-white">Sincronização</span>
                </div>
                <p className="text-xs text-slate-400">
                  {pendingSync.length} item(s) aguardando sincronização
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Notificações */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-400">Notificações Push</h3>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-white">Habilitar Notificações</Label>
                <p className="text-sm text-slate-400">
                  Receber notificações sobre atualizações e eventos importantes
                </p>
              </div>
              {permission !== 'granted' && (
                <Button
                  onClick={handleNotificationPermission}
                  variant="outline"
                  className="flex items-center gap-2 border-white/10 text-white hover:bg-white/10"
                >
                  <Bell className="w-4 h-4" />
                  Permitir
                </Button>
              )}
              {permission === 'granted' && (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Habilitado
                </Badge>
              )}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">
                {isInstalled ? '100%' : '0%'}
              </div>
              <div className="text-sm text-blue-300">App Instalado</div>
            </div>
            <div className="text-center p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
              <div className="text-2xl font-bold text-emerald-400">
                {isOnline ? '100%' : '0%'}
              </div>
              <div className="text-sm text-emerald-300">Conectividade</div>
            </div>
            <div className="text-center p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">
                {permission === 'granted' ? '100%' : '0%'}
              </div>
              <div className="text-sm text-purple-300">Notificações</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

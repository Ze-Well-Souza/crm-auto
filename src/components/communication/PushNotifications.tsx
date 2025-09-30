import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCommunication } from "@/contexts/CommunicationContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { 
  Bell, 
  BellOff, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Clock,
  MessageSquare,
  Calendar,
  DollarSign,
  Users
} from "lucide-react";

interface NotificationSettings {
  appointments: boolean;
  payments: boolean;
  messages: boolean;
  system: boolean;
  marketing: boolean;
  sound: boolean;
  vibration: boolean;
  desktop: boolean;
}

interface PushNotificationsProps {
  className?: string;
}

export const PushNotifications: React.FC<PushNotificationsProps> = ({ 
  className = "" 
}) => {
  const { pushNotificationsEnabled, togglePushNotifications } = useCommunication();
  const { showSuccess, showError, showInfo } = useNotifications();
  
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    appointments: true,
    payments: true,
    messages: true,
    system: true,
    marketing: false,
    sound: true,
    vibration: true,
    desktop: true
  });

  useEffect(() => {
    // Verificar se o navegador suporta notificações
    setIsSupported('Notification' in window);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Carregar configurações salvas
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      showError('Seu navegador não suporta notificações push.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        showSuccess('Notificações push foram habilitadas com sucesso!');
        
        // Enviar notificação de teste
        sendTestNotification();
      } else {
        showError('Para receber notificações, permita o acesso nas configurações do navegador.');
      }
    } catch (error) {
      showError('Erro ao solicitar permissão para notificações.');
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('CRM Parceiro', {
        body: 'Notificações push estão funcionando corretamente!',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification'
      });
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('notification-settings', JSON.stringify(newSettings));
    
    showInfo(`Notificações de ${key} foram ${value ? 'habilitadas' : 'desabilitadas'}.`);
  };

  const getPermissionStatus = () => {
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
          icon: <Clock className="w-4 h-4 text-yellow-600" />,
          text: 'Pendente',
          color: 'bg-yellow-100 text-yellow-800'
        };
    }
  };

  const notificationTypes = [
    {
      key: 'appointments' as keyof NotificationSettings,
      label: 'Agendamentos',
      description: 'Novos agendamentos, lembretes e cancelamentos',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      key: 'payments' as keyof NotificationSettings,
      label: 'Pagamentos',
      description: 'Pagamentos recebidos, pendências e vencimentos',
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      key: 'messages' as keyof NotificationSettings,
      label: 'Mensagens',
      description: 'Novas mensagens de clientes e conversas',
      icon: <MessageSquare className="w-4 h-4" />
    },
    {
      key: 'system' as keyof NotificationSettings,
      label: 'Sistema',
      description: 'Atualizações do sistema e alertas importantes',
      icon: <Settings className="w-4 h-4" />
    },
    {
      key: 'marketing' as keyof NotificationSettings,
      label: 'Marketing',
      description: 'Campanhas, promoções e novidades',
      icon: <Users className="w-4 h-4" />
    }
  ];

  const behaviorSettings = [
    {
      key: 'sound' as keyof NotificationSettings,
      label: 'Som',
      description: 'Reproduzir som ao receber notificações'
    },
    {
      key: 'vibration' as keyof NotificationSettings,
      label: 'Vibração',
      description: 'Vibrar dispositivo ao receber notificações'
    },
    {
      key: 'desktop' as keyof NotificationSettings,
      label: 'Desktop',
      description: 'Mostrar notificações na área de trabalho'
    }
  ];

  const statusInfo = getPermissionStatus();

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Notificações Push
          </CardTitle>
          <CardDescription>
            Configure e gerencie notificações push para manter-se atualizado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status e Permissão */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {statusInfo.icon}
                <span className="font-medium">Status:</span>
              </div>
              <Badge className={statusInfo.color}>
                {statusInfo.text}
              </Badge>
            </div>
            
            {permission !== 'granted' && (
              <Button 
                onClick={requestPermission}
                disabled={!isSupported}
                size="sm"
              >
                Solicitar Permissão
              </Button>
            )}
            
            {permission === 'granted' && (
              <Button 
                onClick={sendTestNotification}
                variant="outline"
                size="sm"
              >
                Testar Notificação
              </Button>
            )}
          </div>

          {!isSupported && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Não Suportado</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Seu navegador não suporta notificações push. 
                Considere atualizar para uma versão mais recente.
              </p>
            </div>
          )}

          {/* Configurações Globais */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">
                  Notificações Push Globais
                </Label>
                <p className="text-sm text-gray-600">
                  Habilitar/desabilitar todas as notificações push
                </p>
              </div>
              <Switch
                checked={pushNotificationsEnabled}
                onCheckedChange={togglePushNotifications}
                disabled={permission !== 'granted'}
              />
            </div>
          </div>

          <Separator />

          {/* Tipos de Notificação */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tipos de Notificação</h3>
            <div className="space-y-4">
              {notificationTypes.map((type) => (
                <div key={type.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {type.icon}
                    </div>
                    <div>
                      <Label className="font-medium">{type.label}</Label>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings[type.key]}
                    onCheckedChange={(checked) => updateSetting(type.key, checked)}
                    disabled={!pushNotificationsEnabled || permission !== 'granted'}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Comportamento */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Comportamento</h3>
            <div className="space-y-4">
              {behaviorSettings.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">{setting.label}</Label>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <Switch
                    checked={settings[setting.key]}
                    onCheckedChange={(checked) => updateSetting(setting.key, checked)}
                    disabled={!pushNotificationsEnabled || permission !== 'granted'}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">127</div>
              <div className="text-sm text-blue-700">Notificações Enviadas</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <div className="text-sm text-green-700">Taxa de Entrega</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">85%</div>
              <div className="text-sm text-purple-700">Taxa de Cliques</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
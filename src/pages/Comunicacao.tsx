import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Bell, 
  Users, 
  Send,
  Settings,
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

// Importar componentes de comunicação
import { WhatsAppIntegration } from "@/components/communication/WhatsAppIntegration";
import { EmailIntegration } from "@/components/communication/EmailIntegration";
import { ChatInterface } from "@/components/communication/ChatInterface";
import { PushNotifications } from "@/components/communication/PushNotifications";
import { useCommunication } from "@/contexts/CommunicationContext";

const Comunicacao = () => {
  const { conversations, messages, loading } = useCommunication();
  
  // Estatísticas de comunicação
  const totalConversations = conversations.length;
  const unreadMessages = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);
  const totalMessages = messages.length;
  const activeChannels = ['WhatsApp', 'Email', 'Chat Interno', 'Push Notifications'];

  // Estatísticas por canal
  const channelStats = {
    whatsapp: messages.filter(m => m.channel === 'whatsapp').length,
    email: messages.filter(m => m.channel === 'email').length,
    internal: messages.filter(m => m.channel === 'internal').length,
    sms: messages.filter(m => m.channel === 'sms').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">
            Central de Comunicação
          </h1>
          <p className="text-slate-400 text-lg">
            Gerencie todas as comunicações com seus clientes em um só lugar
          </p>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-slate-300">Conversas Ativas</p>
                  <div className="text-2xl font-bold text-white">{totalConversations}</div>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-slate-300">Mensagens Não Lidas</p>
                  <div className="text-2xl font-bold text-white">{unreadMessages}</div>
                </div>
                <Bell className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-slate-300">Total de Mensagens</p>
                  <div className="text-2xl font-bold text-white">{totalMessages}</div>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-slate-300">Canais Ativos</p>
                  <div className="text-2xl font-bold text-white">{activeChannels.length}</div>
                </div>
                <BarChart3 className="h-8 w-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Abas de Comunicação */}
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-300">
              <Users className="h-4 w-4" />
              Chat Interno
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-300">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-300">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-300">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-300">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <ChatInterface />
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-6">
            <WhatsAppIntegration />
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <EmailIntegration />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <PushNotifications />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações de Comunicação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Integrações Ativas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">WhatsApp Business API</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Conectado
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SMTP Email</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Configurado
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Push Notifications</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ativo
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SMS Gateway</span>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Pendente
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Configurações Gerais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar WhatsApp API
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Configurar SMTP
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Configurar SMS Gateway
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Bell className="w-4 h-4 mr-2" />
                        Configurar Push Notifications
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Comunicacao;
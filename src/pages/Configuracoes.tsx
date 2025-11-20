import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { useThemePreferences } from "@/hooks/useThemePreferences";
import { PWAManager } from "@/components/pwa/PWAManager";
import { EmailConfigurationForm } from "@/components/communication/EmailConfigurationForm";
import { 
  Settings, 
  User, 
  Bell, 
  Database,
  Shield,
  Save,
  Download,
  Upload,
  RefreshCw,
  Palette,
  Sun,
  Moon,
  Monitor,
  RotateCcw,
  MessageCircle,
  Phone,
  Key,
  CheckCircle
} from "lucide-react";

const Configuracoes = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { 
    preferences, 
    applyTheme, 
    savePreferences, 
    isDark, 
    isLight, 
    isSystem,
    exportPreferences,
    resetPreferences 
  } = useThemePreferences();
  const [loading, setLoading] = useState(false);
  
  // Company Settings
  const [companySettings, setCompanySettings] = useState({
    name: "Oficina Mecânica Pro",
    address: "Rua das Oficinas, 123",
    phone: "(11) 99999-9999",
    email: "contato@oficinapro.com",
    cnpj: "12.345.678/0001-90",
    website: "www.oficinapro.com"
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    notifications: true,
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: false,
    autoBackup: true,
    darkMode: false,
    language: "pt-BR"
  });

  // WhatsApp Settings
  const [whatsappSettings, setWhatsappSettings] = useState({
    enabled: false,
    businessNumber: "",
    apiToken: "",
    notificationTypes: {
      appointments: true,
      reminders: true,
      serviceStatus: true,
      payments: false
    }
  });

  // Business Settings
  const [businessSettings, setBusinessSettings] = useState({
    workingHours: "08:00 - 18:00",
    workingDays: "Segunda à Sexta",
    appointmentDuration: 60,
    maxAdvanceBooking: 30,
    requirePaymentUpfront: false,
    allowOnlineBooking: true
  });

  const handleSaveSettings = async (section: string) => {
    setLoading(true);
    try {
      // Mock save - in real app would save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configurações salvas",
        description: `As configurações de ${section} foram atualizadas com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // Mock export
    const data = {
      company: companySettings,
      system: systemSettings,
      business: businessSettings,
      exportDate: new Date().toISOString()
    };
    
    console.log("Exporting configuration:", data);
    toast({
      title: "Dados exportados",
      description: "As configurações foram exportadas. Verifique o console.",
    });
  };

  const handleImportData = () => {
    // Mock import
    toast({
      title: "Importação iniciada",
      description: "Selecione o arquivo de configuração para importar.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header - Landing Page Style */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">
              Configurações do Sistema
            </h1>
            <p className="text-slate-400">Gerencie as configurações da sua oficina</p>
          </div>

          <div className="flex items-center gap-2">
            <Button className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10" onClick={handleImportData}>
              <Upload className="mr-2 h-4 w-4" />
              Importar
            </Button>
            <Button className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Company Information - Landing Page Style */}
        <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              Informações da Empresa
            </CardTitle>
            <CardDescription className="text-slate-400">
              Dados básicos da sua oficina que aparecem em relatórios e documentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-yellow-400">Nome da Empresa</Label>
                <Input
                  id="company-name"
                  value={companySettings.name}
                  onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-cnpj" className="text-yellow-400">CNPJ</Label>
                <Input
                  id="company-cnpj"
                  value={companySettings.cnpj}
                  onChange={(e) => setCompanySettings({...companySettings, cnpj: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-phone" className="text-yellow-400">Telefone</Label>
                <Input
                  id="company-phone"
                  value={companySettings.phone}
                  onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-email" className="text-yellow-400">E-mail</Label>
                <Input
                  id="company-email"
                  type="email"
                  value={companySettings.email}
                  onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-address" className="text-yellow-400">Endereço</Label>
              <Textarea
                id="company-address"
                value={companySettings.address}
                onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-website" className="text-yellow-400">Website</Label>
              <Input
                id="company-website"
                value={companySettings.website}
                onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>

            <Button onClick={() => handleSaveSettings("empresa")} disabled={loading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Salvando..." : "Salvar Informações"}
            </Button>
          </CardContent>
        </Card>

        {/* System Notifications - Landing Page Style */}
        <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Bell className="h-5 w-5 text-orange-400" />
              </div>
              Notificações
            </CardTitle>
            <CardDescription className="text-slate-400">
              Configure como o sistema deve notificar sobre eventos importantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base text-yellow-400">Notificações no Sistema</Label>
                <p className="text-sm text-slate-400">
                  Exibir notificações no painel
                </p>
              </div>
              <Switch
                checked={systemSettings.notifications}
                onCheckedChange={(checked) =>
                  setSystemSettings({...systemSettings, notifications: checked})
                }
              />
            </div>

            <Separator className="bg-white/10" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base text-yellow-400">Notificações por E-mail</Label>
                <p className="text-sm text-slate-400">
                  Enviar alertas importantes por e-mail
                </p>
              </div>
              <Switch
                checked={systemSettings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSystemSettings({...systemSettings, emailNotifications: checked})
                }
              />
            </div>

            <Separator className="bg-white/10" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base text-yellow-400">Notificações por SMS</Label>
                <p className="text-sm text-slate-400">
                  Enviar lembretes por SMS
                </p>
              </div>
              <Switch
                checked={systemSettings.smsNotifications}
                onCheckedChange={(checked) =>
                  setSystemSettings({...systemSettings, smsNotifications: checked})
                }
              />
            </div>

            <Separator className="bg-white/10" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base text-yellow-400 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                  Notificações por WhatsApp
                </Label>
                <p className="text-sm text-slate-400">
                  Enviar notificações via WhatsApp Business
                </p>
              </div>
              <Switch
                checked={whatsappSettings.enabled}
                onCheckedChange={(checked) => {
                  setWhatsappSettings({...whatsappSettings, enabled: checked});
                  setSystemSettings({...systemSettings, whatsappNotifications: checked});
                }}
              />
            </div>

            {whatsappSettings.enabled && (
              <div className="ml-6 space-y-4 p-4 border border-white/10 rounded-lg bg-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-number" className="flex items-center gap-2 text-emerald-400">
                      <Phone className="h-4 w-4" />
                      Número do WhatsApp Business
                    </Label>
                    <Input
                      id="whatsapp-number"
                      placeholder="+55 11 99999-9999"
                      value={whatsappSettings.businessNumber}
                      onChange={(e) => setWhatsappSettings({
                        ...whatsappSettings,
                        businessNumber: e.target.value
                      })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-token" className="flex items-center gap-2 text-emerald-400">
                      <Key className="h-4 w-4" />
                      Token da API
                    </Label>
                    <Input
                      id="whatsapp-token"
                      type="password"
                      placeholder="Token da API do WhatsApp"
                      value={whatsappSettings.apiToken}
                      onChange={(e) => setWhatsappSettings({
                        ...whatsappSettings,
                        apiToken: e.target.value
                      })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-emerald-400">Tipos de Notificação</Label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-2 border border-white/10 rounded bg-white/5">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-white">Agendamentos</span>
                      </div>
                      <Switch
                        checked={whatsappSettings.notificationTypes.appointments}
                        onCheckedChange={(checked) => setWhatsappSettings({
                          ...whatsappSettings,
                          notificationTypes: {
                            ...whatsappSettings.notificationTypes,
                            appointments: checked
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 border border-white/10 rounded bg-white/5">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-white">Lembretes</span>
                      </div>
                      <Switch
                        checked={whatsappSettings.notificationTypes.reminders}
                        onCheckedChange={(checked) => setWhatsappSettings({
                          ...whatsappSettings,
                          notificationTypes: {
                            ...whatsappSettings.notificationTypes,
                            reminders: checked
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 border border-white/10 rounded bg-white/5">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-white">Status de Serviços</span>
                      </div>
                      <Switch
                        checked={whatsappSettings.notificationTypes.serviceStatus}
                        onCheckedChange={(checked) => setWhatsappSettings({
                          ...whatsappSettings,
                          notificationTypes: {
                            ...whatsappSettings.notificationTypes,
                            serviceStatus: checked
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 border border-white/10 rounded bg-white/5">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-white">Pagamentos</span>
                      </div>
                      <Switch
                        checked={whatsappSettings.notificationTypes.payments}
                        onCheckedChange={(checked) => setWhatsappSettings({
                          ...whatsappSettings,
                          notificationTypes: {
                            ...whatsappSettings.notificationTypes,
                            payments: checked
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="h-4 w-4 text-blue-400 mt-0.5" />
                    <div className="text-xs text-blue-300">
                      <p className="font-medium">Configuração do WhatsApp Business API</p>
                      <p>Para usar esta funcionalidade, você precisa ter uma conta do WhatsApp Business API configurada. O token pode ser obtido no Meta for Developers.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <Button onClick={() => handleSaveSettings("notificações")} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Salvando..." : "Salvar Notificações"}
            </Button>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <EmailConfigurationForm />

        {/* Appearance Settings */}
        <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Palette className="h-5 w-5 text-purple-400" />
              </div>
              Aparência
            </CardTitle>
            <CardDescription className="text-slate-400">
              Personalize a aparência do sistema conforme sua preferência
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base text-yellow-400">Tema do Sistema</Label>
              <p className="text-sm text-slate-400">
                Escolha entre tema claro, escuro ou automático baseado no sistema
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant={isLight ? "default" : "outline"}
                  onClick={() => applyTheme("light")}
                  className={`flex items-center justify-center gap-2 h-16 transition-theme ${isLight ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0' : 'border-white/10 text-white hover:bg-white/10'}`}
                >
                  <Sun className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Claro</div>
                    <div className="text-xs text-slate-400">Tema claro</div>
                  </div>
                </Button>

                <Button
                  variant={isDark ? "default" : "outline"}
                  onClick={() => applyTheme("dark")}
                  className={`flex items-center justify-center gap-2 h-16 transition-theme ${isDark ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0' : 'border-white/10 text-white hover:bg-white/10'}`}
                >
                  <Moon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Escuro</div>
                    <div className="text-xs text-slate-400">Tema escuro</div>
                  </div>
                </Button>

                <Button
                  variant={isSystem ? "default" : "outline"}
                  onClick={() => applyTheme("system")}
                  className={`flex items-center justify-center gap-2 h-16 transition-theme ${isSystem ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0' : 'border-white/10 text-white hover:bg-white/10'}`}
                >
                  <Monitor className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Sistema</div>
                    <div className="text-xs text-slate-400">Automático</div>
                  </div>
                </Button>
              </div>
            </div>

            <Separator className="bg-white/10" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-yellow-400">Transições Suaves</Label>
                  <div className="text-sm text-slate-400">
                    Ativar animações suaves ao trocar temas
                  </div>
                </div>
                <Switch
                  checked={preferences.smoothTransitions}
                  onCheckedChange={(checked) =>
                    savePreferences({ smoothTransitions: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-yellow-400">Salvar Automaticamente</Label>
                  <div className="text-sm text-slate-400">
                    Salvar preferências automaticamente
                  </div>
                </div>
                <Switch
                  checked={preferences.autoSave}
                  onCheckedChange={(checked) =>
                    savePreferences({ autoSave: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-yellow-400">Sincronizar com Sistema</Label>
                  <div className="text-sm text-slate-400">
                    Seguir tema do sistema operacional
                  </div>
                </div>
                <Switch
                  checked={preferences.systemSync}
                  onCheckedChange={(checked) =>
                    savePreferences({ systemSync: checked })
                  }
                />
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-start gap-3">
                <Palette className="h-5 w-5 text-purple-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">Tema Atual: {
                    theme === "light" ? "Claro" :
                    theme === "dark" ? "Escuro" :
                    "Sistema (Automático)"
                  }</p>
                  <p className="text-xs text-slate-400">
                    O tema é aplicado automaticamente em todo o sistema e salvo nas suas preferências.
                  </p>
                </div>
              </div>

                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const exported = exportPreferences();
                      navigator.clipboard.writeText(JSON.stringify(exported, null, 2));
                      toast({
                        title: "Preferências exportadas",
                        description: "As configurações de tema foram copiadas para a área de transferência.",
                      });
                    }}
                    className="border-white/10 text-white hover:bg-white/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      resetPreferences();
                      toast({
                        title: "Preferências resetadas",
                        description: "As configurações de tema foram restauradas para o padrão.",
                      });
                    }}
                    className="border-white/10 text-white hover:bg-white/10"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Resetar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        {/* Business Rules */}
        <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Settings className="h-5 w-5 text-purple-400" />
              </div>
              Regras de Negócio
            </CardTitle>
            <CardDescription className="text-slate-400">
              Configure o funcionamento do sistema para sua oficina
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="working-hours" className="text-yellow-400">Horário de Funcionamento</Label>
                <Input
                  id="working-hours"
                  value={businessSettings.workingHours}
                  onChange={(e) => setBusinessSettings({...businessSettings, workingHours: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="working-days" className="text-yellow-400">Dias de Funcionamento</Label>
                <Input
                  id="working-days"
                  value={businessSettings.workingDays}
                  onChange={(e) => setBusinessSettings({...businessSettings, workingDays: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointment-duration" className="text-yellow-400">Duração Padrão de Agendamento (minutos)</Label>
                <Input
                  id="appointment-duration"
                  type="number"
                  value={businessSettings.appointmentDuration}
                  onChange={(e) => setBusinessSettings({...businessSettings, appointmentDuration: parseInt(e.target.value)})}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-advance" className="text-yellow-400">Máximo de Dias para Agendamento</Label>
                <Input
                  id="max-advance"
                  type="number"
                  value={businessSettings.maxAdvanceBooking}
                  onChange={(e) => setBusinessSettings({...businessSettings, maxAdvanceBooking: parseInt(e.target.value)})}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <Separator className="bg-white/10" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-yellow-400">Exigir Pagamento Antecipado</Label>
                  <p className="text-sm text-slate-400">
                    Solicitar pagamento no momento do agendamento
                  </p>
                </div>
                <Switch
                  checked={businessSettings.requirePaymentUpfront}
                  onCheckedChange={(checked) =>
                    setBusinessSettings({...businessSettings, requirePaymentUpfront: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-yellow-400">Permitir Agendamento Online</Label>
                  <p className="text-sm text-slate-400">
                    Clientes podem agendar serviços pela internet
                  </p>
                </div>
                <Switch
                  checked={businessSettings.allowOnlineBooking}
                  onCheckedChange={(checked) =>
                    setBusinessSettings({...businessSettings, allowOnlineBooking: checked})
                  }
                />
              </div>
            </div>

            <Button onClick={() => handleSaveSettings("regras de negócio")} disabled={loading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Salvando..." : "Salvar Regras"}
            </Button>
          </CardContent>
        </Card>

        {/* PWA Manager */}
        <PWAManager />

        {/* System Status */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Status do Sistema
            </CardTitle>
            <CardDescription>
              Informações sobre o estado atual do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Backup Automático</p>
                  <p className="text-xs text-muted-foreground">Último: Hoje, 03:00</p>
                </div>
                <Badge variant="secondary">Ativo</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Conexão Database</p>
                  <p className="text-xs text-muted-foreground">Latência: 12ms</p>
                </div>
                <Badge variant="secondary">Conectado</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Versão do Sistema</p>
                  <p className="text-xs text-muted-foreground">v1.0.0</p>
                </div>
                <Badge variant="secondary">Atualizado</Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Verificar Atualizações
              </Button>
              <Button variant="outline">
                <Shield className="mr-2 h-4 w-4" />
                Executar Backup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Configuracoes;
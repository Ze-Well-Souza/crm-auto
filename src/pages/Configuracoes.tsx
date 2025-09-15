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
import { 
  Settings, 
  User, 
  Bell, 
  Database,
  Shield,
  Save,
  Download,
  Upload,
  RefreshCw
} from "lucide-react";

const Configuracoes = () => {
  const { toast } = useToast();
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
    autoBackup: true,
    darkMode: false,
    language: "pt-BR"
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Configurações do Sistema</h1>
            <p className="text-muted-foreground">Gerencie as configurações da sua oficina</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleImportData}>
              <Upload className="mr-2 h-4 w-4" />
              Importar
            </Button>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Company Information */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações da Empresa
            </CardTitle>
            <CardDescription>
              Dados básicos da sua oficina que aparecem em relatórios e documentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input
                  id="company-name"
                  value={companySettings.name}
                  onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-cnpj">CNPJ</Label>
                <Input
                  id="company-cnpj"
                  value={companySettings.cnpj}
                  onChange={(e) => setCompanySettings({...companySettings, cnpj: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-phone">Telefone</Label>
                <Input
                  id="company-phone"
                  value={companySettings.phone}
                  onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company-email">E-mail</Label>
                <Input
                  id="company-email"
                  type="email"
                  value={companySettings.email}
                  onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-address">Endereço</Label>
              <Textarea
                id="company-address"
                value={companySettings.address}
                onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-website">Website</Label>
              <Input
                id="company-website"
                value={companySettings.website}
                onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
              />
            </div>
            
            <Button onClick={() => handleSaveSettings("empresa")} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Salvando..." : "Salvar Informações"}
            </Button>
          </CardContent>
        </Card>

        {/* System Notifications */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como o sistema deve notificar sobre eventos importantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notificações no Sistema</Label>
                <p className="text-sm text-muted-foreground">
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
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notificações por E-mail</Label>
                <p className="text-sm text-muted-foreground">
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
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notificações por SMS</Label>
                <p className="text-sm text-muted-foreground">
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
            
            <Button onClick={() => handleSaveSettings("notificações")} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Salvando..." : "Salvar Notificações"}
            </Button>
          </CardContent>
        </Card>

        {/* Business Rules */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Regras de Negócio
            </CardTitle>
            <CardDescription>
              Configure o funcionamento do sistema para sua oficina
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="working-hours">Horário de Funcionamento</Label>
                <Input
                  id="working-hours"
                  value={businessSettings.workingHours}
                  onChange={(e) => setBusinessSettings({...businessSettings, workingHours: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="working-days">Dias de Funcionamento</Label>
                <Input
                  id="working-days"
                  value={businessSettings.workingDays}
                  onChange={(e) => setBusinessSettings({...businessSettings, workingDays: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="appointment-duration">Duração Padrão de Agendamento (minutos)</Label>
                <Input
                  id="appointment-duration"
                  type="number"
                  value={businessSettings.appointmentDuration}
                  onChange={(e) => setBusinessSettings({...businessSettings, appointmentDuration: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-advance">Máximo de Dias para Agendamento</Label>
                <Input
                  id="max-advance"
                  type="number"
                  value={businessSettings.maxAdvanceBooking}
                  onChange={(e) => setBusinessSettings({...businessSettings, maxAdvanceBooking: parseInt(e.target.value)})}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Exigir Pagamento Antecipado</Label>
                  <p className="text-sm text-muted-foreground">
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
                  <Label className="text-base">Permitir Agendamento Online</Label>
                  <p className="text-sm text-muted-foreground">
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
            
            <Button onClick={() => handleSaveSettings("regras de negócio")} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Salvando..." : "Salvar Regras"}
            </Button>
          </CardContent>
        </Card>

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
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Bell, Shield, Database, Palette } from "lucide-react";

const Configuracoes = () => {
  const configSections = [
    {
      title: "Perfil da Empresa",
      description: "Informações básicas da oficina",
      icon: User,
      items: [
        { label: "Nome da Empresa", type: "input", value: "Oficina Eficiente" },
        { label: "CNPJ", type: "input", value: "12.345.678/0001-90" },
        { label: "Telefone", type: "input", value: "(11) 99999-9999" },
        { label: "Email", type: "input", value: "contato@oficina.com" }
      ]
    },
    {
      title: "Notificações",
      description: "Configure alertas e lembretes",
      icon: Bell,
      items: [
        { label: "Email para novos agendamentos", type: "switch", value: true },
        { label: "SMS para clientes", type: "switch", value: false },
        { label: "Alertas de estoque baixo", type: "switch", value: true },
        { label: "Relatórios automáticos", type: "switch", value: true }
      ]
    },
    {
      title: "Segurança",
      description: "Configurações de acesso e segurança",
      icon: Shield,
      items: [
        { label: "Autenticação em duas etapas", type: "switch", value: false },
        { label: "Backup automático", type: "switch", value: true },
        { label: "Log de atividades", type: "switch", value: true }
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema e preferências da oficina
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="gradient-card cursor-pointer hover:shadow-elevated transition-smooth">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                Backup de Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Último backup: {new Date().toLocaleDateString('pt-BR')}
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Fazer Backup
              </Button>
            </CardContent>
          </Card>

          <Card className="gradient-card cursor-pointer hover:shadow-elevated transition-smooth">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                Tema do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Modo atual: Claro
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Alterar Tema
              </Button>
            </CardContent>
          </Card>

          <Card className="gradient-card cursor-pointer hover:shadow-elevated transition-smooth">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                Configurações Avançadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Acesso completo às configurações
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Acessar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Sections */}
        <div className="space-y-6">
          {configSections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  {section.title}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    {item.type === 'input' ? (
                      <div className="space-y-2">
                        <Label htmlFor={`${section.title}-${itemIndex}`}>
                          {item.label}
                        </Label>
                        <Input
                          id={`${section.title}-${itemIndex}`}
                          defaultValue={item.value as string}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{item.label}</Label>
                        </div>
                        <Switch defaultChecked={item.value as boolean} />
                      </div>
                    )}
                    {itemIndex < section.items.length - 1 && (
                      <Separator className="mt-6" />
                    )}
                  </div>
                ))}
                <div className="pt-4">
                  <Button>Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
            <CardDescription>
              Detalhes sobre a versão e status do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Versão do Sistema</Label>
                <p className="text-sm text-muted-foreground">v2.1.0</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Última Atualização</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status do Sistema</Label>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <p className="text-sm text-muted-foreground">Online e funcionando</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Suporte</Label>
                <p className="text-sm text-muted-foreground">suporte@oficinaeficiente.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Configuracoes;
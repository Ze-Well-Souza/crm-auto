import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Download, Calendar, TrendingUp, Users, Car, Wrench } from "lucide-react";

const Relatorios = () => {
  const reportTypes = [
    {
      title: "Relatório de Vendas",
      description: "Análise detalhada das vendas por período, cliente e serviço",
      icon: TrendingUp,
      type: "vendas"
    },
    {
      title: "Relatório de Clientes",
      description: "Histórico completo de clientes, serviços realizados e faturamento",
      icon: Users,
      type: "clientes"
    },
    {
      title: "Relatório de Veículos",
      description: "Manutenções realizadas, custos e histórico por veículo",
      icon: Car,
      type: "veiculos"
    },
    {
      title: "Relatório de Serviços",
      description: "Performance dos serviços, tempo médio e rentabilidade",
      icon: Wrench,
      type: "servicos"
    },
    {
      title: "Relatório Financeiro",
      description: "Fluxo de caixa, receitas, despesas e análise de lucratividade",
      icon: BarChart3,
      type: "financeiro"
    },
    {
      title: "Relatório de Estoque",
      description: "Movimentação de estoque, peças mais utilizadas e custos",
      icon: BarChart3,
      type: "estoque"
    }
  ];

  const quickStats = [
    {
      title: "Relatórios Gerados",
      value: "147",
      change: "+12% este mês",
      icon: FileText
    },
    {
      title: "Último Relatório",
      value: "2 dias atrás",
      change: "Relatório de vendas",
      icon: Calendar
    },
    {
      title: "Downloads",
      value: "89",
      change: "Este mês",
      icon: Download
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Relatórios e Analytics</h1>
          <p className="text-muted-foreground">
            Gere relatórios detalhados e acompanhe indicadores de performance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStats.map((stat) => (
            <Card key={stat.title} className="gradient-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <stat.icon className="h-4 w-4 text-primary" />
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Types */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Tipos de Relatórios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTypes.map((report) => (
              <Card key={report.type} className="hover:shadow-elevated transition-smooth cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <report.icon className="h-5 w-5 text-primary" />
                    </div>
                    {report.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Gerar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Relatórios Recentes</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Relatório de Vendas - Dezembro 2024</h3>
                        <p className="text-sm text-muted-foreground">
                          Gerado em {new Date().toLocaleDateString('pt-BR')} • 245 KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Dashboard Preview */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Dashboard de Analytics</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Métricas Principais</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Faturamento Mensal</span>
                      <span className="font-semibold">R$ 45.890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Serviços Concluídos</span>
                      <span className="font-semibold">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Ticket Médio</span>
                      <span className="font-semibold">R$ 294,17</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium">Crescimento</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Novos Clientes</span>
                      <span className="font-semibold text-success">+12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Faturamento</span>
                      <span className="font-semibold text-success">+8.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Produtividade</span>
                      <span className="font-semibold text-success">+15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Relatorios;
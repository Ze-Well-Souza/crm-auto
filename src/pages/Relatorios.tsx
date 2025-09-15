import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, Download, TrendingUp, TrendingDown, BarChart3, PieChart, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useClients } from "@/hooks/useClients";
import { useVehicles } from "@/hooks/useVehicles";
import { usePartsNew } from "@/hooks/usePartsNew";
import { useFinancialTransactionsNew } from "@/hooks/useFinancialTransactionsNew";
import { useAppointmentsNew } from "@/hooks/useAppointmentsNew";
import { useServiceOrders } from "@/hooks/useServiceOrders";

const Relatorios = () => {
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });

  // Data hooks
  const { clients, loading: clientsLoading } = useClients();
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const { parts, loading: partsLoading } = usePartsNew();
  const { transactions, loading: transactionsLoading } = useFinancialTransactionsNew();
  const { appointments, loading: appointmentsLoading } = useAppointmentsNew();
  const { serviceOrders, loading: serviceOrdersLoading } = useServiceOrders();

  const isLoading = clientsLoading || vehiclesLoading || partsLoading || 
                   transactionsLoading || appointmentsLoading || serviceOrdersLoading;

  // Calculate metrics based on data
  const totalClients = clients?.length || 0;
  const totalVehicles = vehicles?.length || 0;
  const totalParts = parts?.length || 0;
  const lowStockParts = parts?.filter(p => p.min_stock && p.stock_quantity && p.stock_quantity <= p.min_stock).length || 0;
  
  const totalReceitas = transactions?.filter(t => t.type === 'receita').reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalDespesas = transactions?.filter(t => t.type === 'despesa').reduce((sum, t) => sum + t.amount, 0) || 0;
  const saldo = totalReceitas - totalDespesas;
  
  const totalAppointments = appointments?.length || 0;
  const pendingAppointments = appointments?.filter(a => a.status === 'agendado').length || 0;
  const completedAppointments = appointments?.filter(a => a.status === 'concluido').length || 0;
  
  const totalServiceOrders = serviceOrders?.length || 0;
  const completedServiceOrders = serviceOrders?.filter(so => so.status === 'finalizado').length || 0;

  const generatePDF = (reportType: string) => {
    // Mock PDF generation - in real app would use jsPDF or similar
    const data = {
      type: reportType,
      date: new Date().toISOString(),
      period: `${format(dateRange.from || new Date(), 'dd/MM/yyyy')} - ${format(dateRange.to || new Date(), 'dd/MM/yyyy')}`,
      metrics: {
        totalClients,
        totalVehicles,
        totalReceitas,
        totalDespesas,
        saldo,
        totalAppointments,
        completedAppointments,
        totalServiceOrders,
        completedServiceOrders
      }
    };
    
    console.log(`Generating ${reportType} PDF:`, data);
    alert(`Relatório ${reportType} seria gerado aqui. Dados no console.`);
  };

  const reportTypes = [
    {
      title: "Relatório Financeiro",
      description: "Receitas, despesas e fluxo de caixa detalhado",
      icon: TrendingUp,
      type: "financeiro",
      color: "text-success"
    },
    {
      title: "Relatório de Clientes",
      description: "Análise de clientes ativos e histórico de serviços",
      icon: BarChart3,
      type: "clientes",
      color: "text-primary"
    },
    {
      title: "Relatório de Estoque",
      description: "Controle de peças, movimentações e alertas",
      icon: PieChart,
      type: "estoque",
      color: "text-warning"
    },
    {
      title: "Relatório de Serviços",
      description: "Performance de agendamentos e ordens de serviço",
      icon: FileText,
      type: "servicos",
      color: "text-info"
    }
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Relatórios e Análises</h1>
            <p className="text-muted-foreground">Métricas de performance e relatórios customizáveis</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Selecionar período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange as any}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Total de entradas</p>
            </CardContent>
          </Card>
          
          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Total de saídas</p>
            </CardContent>
          </Card>
          
          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className={`h-4 w-4 ${saldo >= 0 ? 'text-success' : 'text-destructive'}`} />
                Saldo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-success' : 'text-destructive'}`}>
                R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Resultado líquido</p>
            </CardContent>
          </Card>
          
          <Card className="gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <PieChart className="h-4 w-4 text-primary" />
                Serviços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {completedServiceOrders}
              </div>
              <p className="text-xs text-muted-foreground">Ordens finalizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Report Generation Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Gerar Relatórios</h2>
            <Button onClick={() => generatePDF('completo')} className="shadow-primary">
              <Download className="mr-2 h-4 w-4" />
              Exportar Tudo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTypes.map((report) => (
              <Card key={report.type} className="gradient-card hover:shadow-elevated transition-smooth">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <report.icon className={`h-6 w-6 ${report.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {report.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {report.type === 'financeiro' && (
                      <>
                        <div>
                          <span className="text-muted-foreground">Receitas:</span>
                          <p className="font-semibold text-success">R$ {totalReceitas.toLocaleString('pt-BR')}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Despesas:</span>
                          <p className="font-semibold text-destructive">R$ {totalDespesas.toLocaleString('pt-BR')}</p>
                        </div>
                      </>
                    )}
                    {report.type === 'clientes' && (
                      <>
                        <div>
                          <span className="text-muted-foreground">Total:</span>
                          <p className="font-semibold">{totalClients}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Veículos:</span>
                          <p className="font-semibold">{totalVehicles}</p>
                        </div>
                      </>
                    )}
                    {report.type === 'estoque' && (
                      <>
                        <div>
                          <span className="text-muted-foreground">Total:</span>
                          <p className="font-semibold">{totalParts}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Baixo:</span>
                          <p className="font-semibold text-warning">{lowStockParts}</p>
                        </div>
                      </>
                    )}
                    {report.type === 'servicos' && (
                      <>
                        <div>
                          <span className="text-muted-foreground">Agendamentos:</span>
                          <p className="font-semibold">{totalAppointments}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ordens:</span>
                          <p className="font-semibold">{totalServiceOrders}</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => generatePDF(report.type)} 
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Gerar PDF
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Resumo Operacional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Agendamentos</span>
                    <span className="font-semibold">{totalAppointments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pendentes</span>
                    <Badge variant="secondary">{pendingAppointments}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ordens</span>
                    <span className="font-semibold">{totalServiceOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Finalizadas</span>
                    <Badge variant="secondary">{completedServiceOrders}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Status do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Base de Clientes</span>
                  <Badge variant="secondary">{totalClients} ativos</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Controle de Estoque</span>
                  <Badge variant={lowStockParts > 0 ? "destructive" : "secondary"}>
                    {lowStockParts > 0 ? `${lowStockParts} alertas` : 'OK'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Resultado Financeiro</span>
                  <Badge variant={saldo >= 0 ? "secondary" : "destructive"}>
                    {saldo >= 0 ? 'Positivo' : 'Negativo'}
                  </Badge>
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
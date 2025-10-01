import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar as CalendarIcon, Download, TrendingUp, TrendingDown, ChartBar as BarChart3, ChartPie as PieChart, FileText, DollarSign, Users, Car, Wrench, FileSpreadsheet, Filter, RefreshCw, Settings, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";
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
import { ReportsChart } from "@/components/reports/ReportsChart";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { AdvancedChart } from "@/components/reports/AdvancedChart";
import { AnalyticsDashboard } from "@/components/reports/AnalyticsDashboard";
import { exportToPDF, exportToExcel, exportToCSV } from "@/utils/exportUtils";

const Relatorios = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState("Este mês");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Hooks para buscar dados
  const { clients: clientes = [], loading: loadingClientes } = useClients();
  const { vehicles: veiculos = [], loading: loadingVeiculos } = useVehicles();
  const { parts: pecas = [], loading: loadingPecas } = usePartsNew();
  const { transactions: transacoes = [], loading: loadingTransacoes } = useFinancialTransactionsNew();
  const { appointments: agendamentos = [], loading: loadingAgendamentos } = useAppointmentsNew();
  const { serviceOrders: ordensServico = [], loading: loadingOrdens } = useServiceOrders();

  const isLoading = loadingClientes || loadingVeiculos || loadingPecas || 
                   loadingTransacoes || loadingAgendamentos || loadingOrdens;

  // Calculate metrics based on data
  const totalClients = clientes?.length || 0;
  const totalVehicles = veiculos?.length || 0;
  const totalParts = pecas?.length || 0;
  const lowStockParts = pecas?.filter(p => p.min_stock && p.stock_quantity && p.stock_quantity <= p.min_stock).length || 0;
  
  const totalReceitas = transacoes?.filter(t => t.type === 'receita').reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalDespesas = transacoes?.filter(t => t.type === 'despesa').reduce((sum, t) => sum + t.amount, 0) || 0;
  const saldo = totalReceitas - totalDespesas;
  
  const totalAppointments = agendamentos?.length || 0;
  const pendingAppointments = agendamentos?.filter(a => a.status === 'agendado').length || 0;
  const completedAppointments = agendamentos?.filter(a => a.status === 'concluido').length || 0;
  
  const totalServiceOrders = ordensServico?.length || 0;
  const completedServiceOrders = ordensServico?.filter(so => so.status === 'concluido').length || 0;

  // Funções de exportação
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const reportData = {
        title: 'Relatório Geral',
        period: selectedPeriod,
        metrics: {
          totalRevenue: totalReceitas,
          totalExpenses: totalDespesas,
          totalClients,
          totalVehicles,
          totalAppointments,
          totalServiceOrders
        },
        data: {
          clientes,
          veiculos,
          transacoes,
          agendamentos,
          ordensServico
        }
      };
      await exportToPDF([reportData], { filename: 'relatorio-geral' });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const reportData = {
        title: 'Relatório Geral',
        period: selectedPeriod,
        metrics: {
          totalRevenue: totalReceitas,
          totalExpenses: totalDespesas,
          totalClients,
          totalVehicles,
          totalAppointments,
          totalServiceOrders
        },
        data: {
          clientes,
          veiculos,
          transacoes,
          agendamentos,
          ordensServico
        }
      };
      await exportToExcel([reportData], { filename: 'relatorio-geral' });
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const reportData = {
        title: 'Relatório Geral',
        period: selectedPeriod,
        metrics: {
          totalRevenue: totalReceitas,
          totalExpenses: totalDespesas,
          totalClients,
          totalVehicles,
          totalAppointments,
          totalServiceOrders
        },
        data: {
          clientes,
          veiculos,
          transacoes,
          agendamentos,
          ordensServico
        }
      };
      await exportToCSV([reportData], { filename: 'relatorio-geral' });
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleApplyFilters = (filters: any[]) => {
    setActiveFilters(filters);
    // Implementar lógica de filtros
    console.log('Filtros aplicados:', filters);
  };

  const generatePDF = (reportType: string) => {
    // Mock PDF generation - in real app would use jsPDF or similar
    const data = {
      type: reportType,
      date: new Date().toISOString(),
      period: selectedPeriod,
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios Avançados</h1>
            <p className="text-muted-foreground">
              Análise detalhada e insights do seu negócio
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" disabled={isExporting}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48" align="end">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handleExportPDF}
                    disabled={isExporting}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handleExportExcel}
                    disabled={isExporting}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handleExportCSV}
                    disabled={isExporting}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Filtros Avançados */}
        {showFilters && (
          <ReportFilters
            filters={[]}
            onFiltersChange={() => {}}
            onApplyFilters={() => handleApplyFilters([])}
            onExport={(format) => {
              if (format === 'pdf') handleExportPDF();
              else if (format === 'excel') handleExportExcel();
              else handleExportCSV();
            }}
          />
        )}

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
        {/* Analytics Dashboard Avançado */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Tempo Real
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </div>
          </div>
          
          <AnalyticsDashboard
            data={{
              clientes,
              veiculos,
              transacoes,
              agendamentos,
              ordensServico
            }}
            period={selectedPeriod}
          />
        </div>

        {/* Interactive Charts Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Gráficos Detalhados</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportsChart 
              title="Análise Financeira"
              type="revenue"
              period={selectedPeriod}
            />
            
            <ReportsChart 
              title="Performance de Clientes"
              type="clients"
              period={selectedPeriod}
            />
            
            <ReportsChart 
              title="Análise de Serviços"
              type="services"
              period={selectedPeriod}
            />
            
            <ReportsChart 
              title="Gestão de Veículos"
              type="vehicles"
              period={selectedPeriod}
            />
          </div>
        </div>

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
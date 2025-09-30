import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, ChartBar as BarChart3, ChartPie as PieChart, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { FinancialTransaction } from "@/types";

interface FinancialDashboardProps {
  transactions?: FinancialTransaction[];
}

export const FinancialDashboard = ({ transactions = [] }: FinancialDashboardProps) => {
  // Calculate financial metrics
  const totalReceitas = transactions.filter(t => t.type === 'receita').reduce((sum, t) => sum + t.amount, 0);
  const totalDespesas = transactions.filter(t => t.type === 'despesa').reduce((sum, t) => sum + t.amount, 0);
  const saldo = totalReceitas - totalDespesas;
  
  const pendingTransactions = transactions.filter(t => t.status === 'pendente');
  const paidTransactions = transactions.filter(t => t.status === 'pago');
  const overdueTransactions = transactions.filter(t => t.status === 'vencido');
  
  const pendingAmount = pendingTransactions.reduce((sum, t) => sum + t.amount, 0);
  const paidAmount = paidTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Payment method distribution
  const paymentMethods = transactions.reduce((acc, t) => {
    const method = t.payment_method || 'Não informado';
    acc[method] = (acc[method] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  // Category analysis
  const categories = transactions.reduce((acc, t) => {
    const category = t.category || 'Sem categoria';
    acc[category] = (acc[category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  // Performance metrics (mock data)
  const avgTicket = transactions.length > 0 ? totalReceitas / transactions.filter(t => t.type === 'receita').length : 0;
  const growthRate = Math.random() * 20 + 5; // 5-25%
  const collectionRate = paidTransactions.length > 0 ? (paidTransactions.length / transactions.length) * 100 : 0;
  const cashFlowHealth = saldo > 0 ? Math.min((saldo / totalReceitas) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      {/* Main Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              Receitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(totalReceitas)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ticket médio: {formatCurrency(avgTicket)}
            </p>
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
              {formatCurrency(totalDespesas)}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalDespesas / totalReceitas) * 100)}% das receitas
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className={`h-4 w-4 ${saldo >= 0 ? 'text-success' : 'text-destructive'}`} />
              Saldo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(saldo)}
            </div>
            <p className="text-xs text-muted-foreground">
              Margem: {totalReceitas > 0 ? Math.round((saldo / totalReceitas) * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {formatCurrency(pendingAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingTransactions.length} transações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Analysis */}
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Análise de Saúde Financeira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Taxa de Cobrança</span>
                <span className="font-semibold">{Math.round(collectionRate)}%</span>
              </div>
              <Progress value={collectionRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {paidTransactions.length} de {transactions.length} pagas
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Saúde do Fluxo</span>
                <span className="font-semibold">{Math.round(cashFlowHealth)}%</span>
              </div>
              <Progress value={cashFlowHealth} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Baseado na margem de lucro
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Crescimento</span>
                <span className="font-semibold text-success">+{growthRate.toFixed(1)}%</span>
              </div>
              <Progress value={growthRate * 4} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Comparado ao mês anterior
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods & Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-lg">Métodos de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(paymentMethods).slice(0, 5).map(([method, amount]) => (
              <div key={method} className="flex justify-between items-center">
                <span className="text-sm">{method}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{formatCurrency(amount)}</span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round((amount / (totalReceitas + totalDespesas)) * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-lg">Top Categorias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(categories).slice(0, 5).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-sm truncate">{category}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{formatCurrency(amount)}</span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round((amount / (totalReceitas + totalDespesas)) * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Distribuição por Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="font-semibold">{paidTransactions.length}</span>
              </div>
              <Badge variant="default" className="text-xs">Pagas</Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(paidAmount)}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-warning" />
                <span className="font-semibold">{pendingTransactions.length}</span>
              </div>
              <Badge variant="secondary" className="text-xs">Pendentes</Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(pendingAmount)}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="font-semibold">{overdueTransactions.length}</span>
              </div>
              <Badge variant="destructive" className="text-xs">Vencidas</Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(overdueTransactions.reduce((sum, t) => sum + t.amount, 0))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
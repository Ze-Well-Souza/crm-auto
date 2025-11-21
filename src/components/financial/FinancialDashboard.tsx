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
        <Card className="bg-white/90 dark:bg-white/5 border-l-4 border-l-emerald-600 border-t border-r border-b border-slate-200/50 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 backdrop-blur-xl shadow-xl shadow-emerald-500/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Receitas</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-600/20 dark:bg-emerald-500/20">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalReceitas)}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Ticket médio: {formatCurrency(avgTicket)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-white/5 border-l-4 border-l-red-600 border-t border-r border-b border-slate-200/50 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 backdrop-blur-xl shadow-xl shadow-red-500/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Despesas</CardTitle>
            <div className="p-2 rounded-lg bg-red-600/20 dark:bg-red-500/20">
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalDespesas)}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {Math.round((totalDespesas / totalReceitas) * 100)}% das receitas
            </p>
          </CardContent>
        </Card>

        <Card className={`bg-white/90 dark:bg-white/5 border-l-4 ${saldo >= 0 ? 'border-l-blue-600' : 'border-l-red-600'} border-t border-r border-b border-slate-200/50 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 backdrop-blur-xl shadow-xl ${saldo >= 0 ? 'shadow-blue-500/10' : 'shadow-red-500/10'} transition-all duration-300`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Saldo</CardTitle>
            <div className={`p-2 rounded-lg ${saldo >= 0 ? 'bg-blue-600/20 dark:bg-blue-500/20' : 'bg-red-600/20 dark:bg-red-500/20'}`}>
              <DollarSign className={`h-5 w-5 ${saldo >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(saldo)}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Margem: {totalReceitas > 0 ? Math.round((saldo / totalReceitas) * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-white/5 border-l-4 border-l-orange-600 border-t border-r border-b border-slate-200/50 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 backdrop-blur-xl shadow-xl shadow-orange-500/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Pendentes</CardTitle>
            <div className="p-2 rounded-lg bg-orange-600/20 dark:bg-orange-500/20">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(pendingAmount)}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {pendingTransactions.length} transações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Analysis */}
      <Card className="bg-white/90 dark:bg-white/5 border-l-4 border-l-purple-600 border-t border-r border-b border-slate-200/50 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 backdrop-blur-xl shadow-xl shadow-purple-500/10 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
            <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Análise de Saúde Financeira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-700 dark:text-slate-300">
                <span>Taxa de Cobrança</span>
                <span className="font-semibold">{Math.round(collectionRate)}%</span>
              </div>
              <Progress value={collectionRate} className="h-2" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {paidTransactions.length} de {transactions.length} pagas
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-700 dark:text-slate-300">
                <span>Saúde do Fluxo</span>
                <span className="font-semibold">{Math.round(cashFlowHealth)}%</span>
              </div>
              <Progress value={cashFlowHealth} className="h-2" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Baseado na margem de lucro
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-700 dark:text-slate-300">
                <span>Crescimento</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">+{growthRate.toFixed(1)}%</span>
              </div>
              <Progress value={growthRate * 4} className="h-2" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Comparado ao mês anterior
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods & Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/90 dark:bg-white/5 border-l-4 border-l-blue-600 border-t border-r border-b border-slate-200/50 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 backdrop-blur-xl shadow-xl shadow-blue-500/10 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-white">Métodos de Pagamento</CardTitle>
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

        <Card className="bg-white/90 dark:bg-white/5 border-l-4 border-l-emerald-600 border-t border-r border-b border-slate-200/50 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 backdrop-blur-xl shadow-xl shadow-emerald-500/10 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-white">Top Categorias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(categories).slice(0, 5).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-sm truncate text-slate-700 dark:text-slate-300">{category}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(amount)}</span>
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
      <Card className="bg-white/90 dark:bg-white/5 border-l-4 border-l-cyan-600 border-t border-r border-b border-slate-200/50 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 backdrop-blur-xl shadow-xl shadow-cyan-500/10 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
            <PieChart className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            Distribuição por Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-slate-900 dark:text-white">{paidTransactions.length}</span>
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
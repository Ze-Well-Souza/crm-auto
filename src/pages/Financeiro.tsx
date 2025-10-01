import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, DollarSign, TrendingUp, TrendingDown, Clock, Filter } from "lucide-react";
import { TransactionForm } from "@/components/financial/TransactionForm";
import { FinancialCard } from "@/components/financial/FinancialCard";
import { FinancialDashboard } from "@/components/financial/FinancialDashboard";
import { SearchAdvanced } from "@/components/common/SearchAdvanced";
import { Pagination } from "@/components/common/Pagination";
import { useFinancialTransactionsNew } from "@/hooks/useFinancialTransactionsNew";
import { useFinancialSearch } from "@/hooks/useAdvancedSearch";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ModuleErrorBoundary } from "@/components/ErrorBoundary";

const Financeiro = () => {
  const [showForm, setShowForm] = useState(false);
  const { transactions, loading, error, refetch, paymentMethods } = useFinancialTransactionsNew();
  
  // Advanced Search Configuration
  const searchConfig = useFinancialSearch(transactions || []);

  const getTypeIcon = (type: string) => {
    return type === 'receita' ? 
      <TrendingUp className="h-4 w-4 text-success" /> : 
      <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  // Filter Groups Configuration
  const filterGroups = [
    {
      key: 'type',
      label: 'Tipo',
      type: 'select' as const,
      options: [
        { value: 'receita', label: 'Receita' },
        { value: 'despesa', label: 'Despesa' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'multiselect' as const,
      options: [
        { value: 'pendente', label: 'Pendente' },
        { value: 'pago', label: 'Pago' },
        { value: 'vencido', label: 'Vencido' },
        { value: 'cancelado', label: 'Cancelado' }
      ]
    },
    {
      key: 'category',
      label: 'Categoria',
      type: 'multiselect' as const,
      options: Array.from(new Set(transactions?.map(t => t.category).filter(Boolean) || [])).map(cat => ({
        value: cat,
        label: cat
      }))
    },
    {
      key: 'payment_method',
      label: 'Método de Pagamento',
      type: 'multiselect' as const,
      options: paymentMethods?.map(pm => ({
        value: pm.name,
        label: pm.name
      })) || []
    },
    {
      key: 'amount_range',
      label: 'Valor',
      type: 'number-range' as const,
      placeholder: { min: 'Valor mín.', max: 'Valor máx.' }
    },
    {
      key: 'date_range',
      label: 'Período',
      type: 'date-range' as const,
      placeholder: { start: 'Data inicial', end: 'Data final' }
    }
  ];

  // Quick Filters Configuration
  const quickFilters = [
    { key: 'pending', label: 'Pendentes', icon: '⏳' },
    { key: 'paid', label: 'Pagos', icon: '✅' },
    { key: 'overdue', label: 'Vencidos', icon: '⚠️' },
    { key: 'high_value', label: 'Alto Valor', icon: '💰' },
    { key: 'this_month', label: 'Este Mês', icon: '📅' },
    { key: 'revenue', label: 'Receitas', icon: '📈' },
    { key: 'expense', label: 'Despesas', icon: '📉' }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive">Erro ao carregar dados financeiros: {error}</p>
            <Button 
              variant="outline" 
              onClick={refetch}
              className="mt-4"
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const totalReceitas = transactions?.filter(t => t.type === 'receita').reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalDespesas = transactions?.filter(t => t.type === 'despesa').reduce((sum, t) => sum + t.amount, 0) || 0;
  const saldo = totalReceitas - totalDespesas;
  const pendentes = transactions?.filter(t => t.status === 'pendente').length || 0;

  return (
    <DashboardLayout>
      <ModuleErrorBoundary 
        moduleName="Financeiro" 
        moduleIcon={<DollarSign className="h-20 w-20 text-yellow-500" />}
        fallbackRoute="/"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Gestão Financeira</h1>
              <p className="text-muted-foreground">Controle de receitas, despesas e fluxo de caixa</p>
            </div>
          
          <Button className="shadow-primary" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        </div>

        {/* Financial Stats */}
        <FinancialDashboard transactions={transactions || []} />

        {/* Advanced Search */}
        <SearchAdvanced
          placeholder="Buscar transações por descrição, categoria..."
          filterGroups={filterGroups as any}
          quickFilters={quickFilters}
          onSearch={searchConfig.handleSearch}
          onReset={searchConfig.handleReset}
          showQuickFilters={true}
          showAdvancedFilters={true}
        />

        {/* Search Results Info */}
        {searchConfig.isFiltered && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                {searchConfig.paginationInfo.totalItems} transação(ões) encontrada(s)
                {searchConfig.paginationInfo.totalItems !== transactions?.length && 
                  ` de ${transactions?.length} total`
                }
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={searchConfig.handleReset}
              className="text-blue-600 hover:text-blue-800"
            >
              Limpar filtros
            </Button>
          </div>
        )}

        {/* Transactions List */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchConfig.data.length > 0 ? (
              searchConfig.data.map((transaction) => (
                <FinancialCard 
                  key={transaction.id} 
                  transaction={transaction} 
                  onUpdate={refetch}
                  onQuickAction={(action, trans) => {
                    console.log(`Ação ${action} para transação:`, trans);
                  }}
                />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  icon={DollarSign}
                  title={searchConfig.isFiltered ? "Nenhuma transação encontrada" : "Nenhuma transação cadastrada"}
                  description={searchConfig.isFiltered 
                    ? "Tente ajustar os termos de busca ou filtros." 
                    : "Comece cadastrando a primeira transação financeira."
                  }
                  actionLabel="Nova Transação"
                  onAction={() => setShowForm(true)}
                  showAction={!searchConfig.isFiltered}
                />
              </div>
            )}
          </div>

          {/* Pagination */}
          {searchConfig.paginationInfo.totalPages > 1 && (
            <Pagination
              paginationInfo={searchConfig.paginationInfo}
              onPageChange={searchConfig.handlePageChange}
              onPageSizeChange={searchConfig.handlePageSizeChange}
              goToFirstPage={searchConfig.goToFirstPage}
              goToLastPage={searchConfig.goToLastPage}
              goToNextPage={searchConfig.goToNextPage}
              goToPreviousPage={searchConfig.goToPreviousPage}
              showPageSizeSelector={true}
              showPageInfo={true}
              showNavigationInfo={true}
            />
          )}
        </div>

        <TransactionForm
          open={showForm}
          onOpenChange={setShowForm}
          onSuccess={refetch}
        />
        </div>
      </ModuleErrorBoundary>
    </DashboardLayout>
  );
};

export default Financeiro;
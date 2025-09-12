import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, DollarSign, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { useFinancialTransactions } from "@/hooks/useFinancialTransactions";

const Financeiro = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { transactions, loading, error } = useFinancialTransactions();

  const getTypeIcon = (type: string) => {
    return type === 'receita' ? 
      <TrendingUp className="h-4 w-4 text-success" /> : 
      <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const getStatusVariant = (status: string | null): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'pago':
        return 'default';
      case 'pendente':
        return 'secondary';
      case 'vencido':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const filteredTransactions = transactions?.filter(transaction => 
    transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Gestão Financeira</h1>
            <p className="text-muted-foreground">Controle de receitas, despesas e fluxo de caixa</p>
          </div>
          
          <Button className="shadow-primary">
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        </div>

        {/* Financial Stats */}
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
                <DollarSign className="h-4 w-4 text-primary" />
                Saldo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-success' : 'text-destructive'}`}>
                R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Receitas - Despesas</p>
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
              <div className="text-2xl font-bold">{pendentes}</div>
              <p className="text-xs text-muted-foreground">Transações pendentes</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações por descrição ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-elevated transition-smooth cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getTypeIcon(transaction.type)}
                      {transaction.description}
                    </CardTitle>
                    <Badge variant={getStatusVariant(transaction.status)}>
                      {transaction.status || 'Pendente'}
                    </Badge>
                  </div>
                  {transaction.category && (
                    <CardDescription>
                      Categoria: {transaction.category}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Valor:</span>
                    <span className={`font-semibold text-lg ${
                      transaction.type === 'receita' ? 'text-success' : 'text-destructive'
                    }`}>
                      {transaction.type === 'receita' ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {transaction.due_date && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Vencimento:</span>
                      <span className="text-sm">
                        {new Date(transaction.due_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}

                  {transaction.payment_method && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Método:</span>
                      <Badge variant="outline">{transaction.payment_method}</Badge>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Criada em {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    {searchTerm ? "Nenhuma transação encontrada" : "Nenhuma transação cadastrada"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                    {searchTerm 
                      ? "Tente ajustar os termos de busca." 
                      : "Comece cadastrando a primeira transação financeira."
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Financeiro;
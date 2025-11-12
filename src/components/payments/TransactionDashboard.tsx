import React, { useState } from 'react';
import { useStripeTransactions } from '@/hooks/useStripeTransactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  QrCode, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_method: 'card' | 'pix' | 'boleto';
  description: string;
  created_at: string;
  updated_at: string;
  order_id?: string;
  customer_name?: string;
  payment_intent_id?: string;
}

interface TransactionStats {
  total_revenue: number;
  total_transactions: number;
  successful_payments: number;
  pending_payments: number;
  failed_payments: number;
  card_payments: number;
  pix_payments: number;
  boleto_payments: number;
}

export const TransactionDashboard: React.FC = () => {
  const { transactions, stats, loading, error } = useStripeTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const filteredTransactions = transactions.filter(transaction => {
    const customerName = transaction.client?.name || '';
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || transaction.payment_method.toLowerCase().includes(methodFilter);
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusBadge = (status: Transaction['status']) => {
    const variants = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const labels = {
      completed: 'Concluído',
      pending: 'Pendente',
      failed: 'Falhou',
      cancelled: 'Cancelado'
    };

    return (
      <Badge className={cn('border', variants[status])}>
        {labels[status]}
      </Badge>
    );
  };

  const getMethodIcon = (method: Transaction['payment_method']) => {
    const icons = {
      card: CreditCard,
      pix: QrCode,
      boleto: FileText
    };
    
    const Icon = icons[method];
    return <Icon className="h-4 w-4" />;
  };

  const getMethodLabel = (method: Transaction['payment_method']) => {
    const labels = {
      card: 'Cartão',
      pix: 'PIX',
      boleto: 'Boleto'
    };
    
    return labels[method];
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.total_revenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_transactions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.successful_payments || 0} concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending_payments || 0}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? Math.round((stats.successful_payments / stats.total_transactions) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.failed_payments || 0} falharam
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
          <CardDescription>
            Histórico completo de pagamentos e transações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, descrição ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Métodos</SelectItem>
                <SelectItem value="card">Cartão</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabela de Transações */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">
                      {transaction.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>{transaction.client?.name || 'N/A'}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMethodIcon(transaction.payment_method)}
                        {getMethodLabel(transaction.payment_method)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                    <TableCell>
                      {formatDate(transaction.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma transação encontrada com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
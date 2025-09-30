import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  QrCode, 
  FileText, 
  Plus, 
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';
import { TransactionDashboard } from '@/components/payments/TransactionDashboard';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { OrderPayment } from '@/components/payments/OrderPayment';
import { WebhookManager } from '@/components/payments/WebhookManager';
import { formatCurrency } from '@/utils/formatters';

// Mock data para ordens de serviço
const mockServiceOrders = [
  {
    id: 'OS001',
    customer_name: 'João Silva',
    customer_email: 'joao@email.com',
    vehicle_info: 'Honda Civic 2020 - ABC-1234',
    description: 'Troca de óleo e filtros',
    status: 'completed' as const,
    payment_status: 'unpaid' as const,
    created_at: '2024-01-15T10:30:00Z',
    scheduled_date: '2024-01-16T09:00:00Z',
    items: [
      {
        id: '1',
        description: 'Óleo motor 5W30',
        quantity: 4,
        unit_price: 25.00,
        total: 100.00
      },
      {
        id: '2',
        description: 'Filtro de óleo',
        quantity: 1,
        unit_price: 30.00,
        total: 30.00
      },
      {
        id: '3',
        description: 'Mão de obra',
        quantity: 1,
        unit_price: 50.00,
        total: 50.00
      }
    ],
    subtotal: 180.00,
    tax: 18.00,
    total: 198.00
  },
  {
    id: 'OS002',
    customer_name: 'Maria Santos',
    customer_email: 'maria@email.com',
    vehicle_info: 'Toyota Corolla 2019 - XYZ-5678',
    description: 'Revisão completa',
    status: 'completed' as const,
    payment_status: 'paid' as const,
    created_at: '2024-01-14T14:20:00Z',
    scheduled_date: '2024-01-15T14:00:00Z',
    items: [
      {
        id: '1',
        description: 'Revisão 20.000km',
        quantity: 1,
        unit_price: 350.00,
        total: 350.00
      }
    ],
    subtotal: 350.00,
    tax: 35.00,
    total: 385.00
  },
  {
    id: 'OS003',
    customer_name: 'Carlos Oliveira',
    customer_email: 'carlos@email.com',
    vehicle_info: 'Ford Focus 2021 - DEF-9012',
    description: 'Troca de pastilhas de freio',
    status: 'in_progress' as const,
    payment_status: 'unpaid' as const,
    created_at: '2024-01-15T16:45:00Z',
    scheduled_date: '2024-01-17T10:00:00Z',
    items: [
      {
        id: '1',
        description: 'Pastilhas de freio dianteiras',
        quantity: 1,
        unit_price: 120.00,
        total: 120.00
      },
      {
        id: '2',
        description: 'Mão de obra',
        quantity: 1,
        unit_price: 80.00,
        total: 80.00
      }
    ],
    subtotal: 200.00,
    tax: 20.00,
    total: 220.00
  }
];

export default function Pagamentos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false);

  const filteredOrders = mockServiceOrders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vehicle_info.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.payment_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total_pending: mockServiceOrders.filter(o => o.payment_status === 'unpaid').length,
    total_paid: mockServiceOrders.filter(o => o.payment_status === 'paid').length,
    total_amount_pending: mockServiceOrders
      .filter(o => o.payment_status === 'unpaid')
      .reduce((sum, o) => sum + o.total, 0),
    total_amount_paid: mockServiceOrders
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + o.total, 0)
  };

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    // Aqui você atualizaria o status do pagamento na base de dados
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Aqui você trataria o erro de pagamento
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pagamentos</h1>
          <p className="text-muted-foreground">
            Gerencie pagamentos e transações das ordens de serviço
          </p>
        </div>
        <Button onClick={() => setIsNewPaymentOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pagamento
        </Button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_pending}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.total_amount_pending)} em aberto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_paid}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.total_amount_paid)} recebido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receita</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.total_amount_paid + stats.total_amount_pending)}
            </div>
            <p className="text-xs text-muted-foreground">
              Receita total do período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats.total_paid / mockServiceOrders.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Ordens pagas vs total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Ordens de Serviço</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="new-payment">Novo Pagamento</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle>Ordens de Serviço</CardTitle>
              <CardDescription>
                Gerencie pagamentos das ordens de serviço
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por cliente, ordem ou veículo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Status do Pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="unpaid">Não Pago</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="failed">Falhou</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lista de Ordens */}
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderPayment
                    key={order.id}
                    order={order}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                ))}
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma ordem de serviço encontrada com os filtros aplicados.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionDashboard />
        </TabsContent>

        <TabsContent value="new-payment">
          <Card>
            <CardHeader>
              <CardTitle>Novo Pagamento</CardTitle>
              <CardDescription>
                Processar um pagamento avulso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentForm
                amount={100}
                currency="BRL"
                description="Pagamento avulso"
                onSuccess={(paymentId) => {
                  console.log('Payment successful:', paymentId);
                }}
                onError={(error) => {
                  console.error('Payment error:', error);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhookManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
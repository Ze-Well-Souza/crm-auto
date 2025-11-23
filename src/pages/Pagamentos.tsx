import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
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

// Tipo para ordens de serviço
interface ServiceOrderForPayment {
  id: string;
  customer_name: string;
  customer_email: string;
  vehicle_info: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  payment_status: 'paid' | 'unpaid' | 'pending';
  created_at: string;
  scheduled_date?: string;
  total: number;
  subtotal: number;
  tax: number;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
}

export default function Pagamentos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrderForPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiceOrders();
  }, []);

  const fetchServiceOrders = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('service_orders')
        .select(`
          *,
          clients:client_id(name, email),
          vehicles:vehicle_id(brand, model, license_plate)
        `)
        .eq('partner_id', user.id)
        .in('status', ['finalizado', 'em_andamento'])
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const transformed: ServiceOrderForPayment[] = (data || []).map(order => {
        const client = order.clients as any;
        const vehicle = order.vehicles as any;
        
        return {
          id: order.order_number || order.id,
          customer_name: client?.name || 'Cliente não informado',
          customer_email: client?.email || 'email@nao-informado.com',
          vehicle_info: vehicle
            ? `${vehicle.brand} ${vehicle.model} - ${vehicle.license_plate}`
            : 'Veículo não informado',
          description: order.description || 'Sem descrição',
          status: order.status === 'finalizado' ? 'completed' : 'in_progress' as any,
          payment_status: order.payment_status || 'unpaid' as any,
          created_at: order.created_at,
          scheduled_date: order.created_at,
          subtotal: Number(order.total_amount) || 0,
          tax: 0,
          total: Number(order.total_amount) || 0,
          items: [
            {
              id: '1',
              description: order.description || 'Serviço',
              quantity: 1,
              unit_price: Number(order.total_amount) || 0,
              total: Number(order.total_amount) || 0
            }
          ]
        };
      });

      setServiceOrders(transformed);
    } catch (err) {
      console.error('Error fetching service orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = serviceOrders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vehicle_info.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.payment_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total_pending: serviceOrders.filter(o => o.payment_status === 'unpaid').length,
    total_paid: serviceOrders.filter(o => o.payment_status === 'paid').length,
    total_amount_pending: serviceOrders
      .filter(o => o.payment_status === 'unpaid')
      .reduce((sum, o) => sum + o.total, 0),
    total_amount_paid: serviceOrders
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
    <DashboardLayout>
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
              {serviceOrders.length > 0 ? Math.round((stats.total_paid / serviceOrders.length) * 100) : 0}%
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
    </DashboardLayout>
  );
}
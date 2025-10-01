import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  QrCode, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  DollarSign,
  User,
  Calendar,
  Wrench
} from 'lucide-react';
import { PaymentForm } from './PaymentForm';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface ServiceOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  vehicle_info: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'pending' | 'paid' | 'failed';
  created_at: string;
  scheduled_date?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
}

interface OrderPaymentProps {
  order: ServiceOrder;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
}

export const OrderPayment: React.FC<OrderPaymentProps> = ({
  order,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusBadge = (status: ServiceOrder['status']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };

    const labels = {
      pending: 'Pendente',
      in_progress: 'Em Andamento',
      completed: 'Concluída',
      cancelled: 'Cancelada'
    };

    return (
      <Badge className={cn('border', variants[status])}>
        {labels[status]}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: ServiceOrder['payment_status']) => {
    const variants = {
      unpaid: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200'
    };

    const labels = {
      unpaid: 'Não Pago',
      pending: 'Pendente',
      paid: 'Pago',
      failed: 'Falhou'
    };

    const icons = {
      unpaid: XCircle,
      pending: Clock,
      paid: CheckCircle,
      failed: XCircle
    };

    const Icon = icons[status];

    return (
      <Badge className={cn('border flex items-center gap-1', variants[status])}>
        <Icon className="h-3 w-3" />
        {labels[status]}
      </Badge>
    );
  };

  const handlePaymentSuccess = (paymentId: string) => {
    setIsProcessing(false);
    setIsPaymentDialogOpen(false);
    onPaymentSuccess?.(paymentId);
  };

  const handlePaymentError = (error: string) => {
    setIsProcessing(false);
    onPaymentError?.(error);
  };

  const canProcessPayment = order.status === 'completed' && order.payment_status !== 'paid';

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Ordem de Serviço #{order.id}
            </CardTitle>
            <CardDescription>
              Criada em {formatDate(order.created_at)}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {getStatusBadge(order.status)}
            {getPaymentStatusBadge(order.payment_status)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Informações do Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              Cliente
            </div>
            <div className="text-sm text-muted-foreground">
              <div>{order.customer_name}</div>
              <div>{order.customer_email}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Agendamento
            </div>
            <div className="text-sm text-muted-foreground">
              {order.scheduled_date ? formatDate(order.scheduled_date) : 'Não agendado'}
            </div>
          </div>
        </div>

        {/* Informações do Veículo */}
        <div>
          <div className="text-sm font-medium mb-2">Veículo</div>
          <div className="text-sm text-muted-foreground">{order.vehicle_info}</div>
        </div>

        {/* Descrição do Serviço */}
        <div>
          <div className="text-sm font-medium mb-2">Descrição</div>
          <div className="text-sm text-muted-foreground">{order.description}</div>
        </div>

        <Separator />

        {/* Itens da Ordem */}
        <div>
          <div className="text-sm font-medium mb-4">Itens do Serviço</div>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.description}</div>
                  <div className="text-xs text-muted-foreground">
                    Qtd: {item.quantity} × {formatCurrency(item.unit_price)}
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {formatCurrency(item.total)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Resumo Financeiro */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Impostos:</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

        {/* Ações de Pagamento */}
        <div className="space-y-4">
          {order.payment_status === 'paid' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Pagamento confirmado! Esta ordem de serviço foi paga com sucesso.
              </AlertDescription>
            </Alert>
          )}

          {order.payment_status === 'failed' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                O pagamento falhou. Tente novamente ou entre em contato com o suporte.
              </AlertDescription>
            </Alert>
          )}

          {order.payment_status === 'pending' && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Pagamento pendente. Aguardando confirmação do processador de pagamentos.
              </AlertDescription>
            </Alert>
          )}

          {canProcessPayment && (
            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Processar Pagamento - {formatCurrency(order.total)}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Processar Pagamento</DialogTitle>
                  <DialogDescription>
                    Ordem de Serviço #{order.id} - {formatCurrency(order.total)}
                  </DialogDescription>
                </DialogHeader>
                <PaymentForm
                  amount={order.total}
                  description={`Pagamento da Ordem de Serviço #${order.id}`}
                  orderId={order.id}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </DialogContent>
            </Dialog>
          )}

          {!canProcessPayment && order.payment_status === 'unpaid' && (
            <Alert>
              <AlertDescription>
                Esta ordem de serviço precisa ser concluída antes do pagamento poder ser processado.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
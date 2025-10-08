import { MarketplaceOrder } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from './OrderStatusBadge';
import { ShoppingBag, User, Phone, Mail, MapPin, Calendar, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderCardProps {
  order: MarketplaceOrder;
  onStatusChange: (orderId: string, status: string, payment_status?: string) => void;
  onDelete: () => void;
}

export const OrderCard = ({ order, onStatusChange, onDelete }: OrderCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Pedido #{order.order_number}</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(order.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={order.status} />
          <Badge variant={order.payment_status === 'pago' ? 'default' : 'secondary'}>
            {order.payment_status || 'pendente'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="font-medium">{order.customer_name}</span>
            </div>
            {order.customer_phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{order.customer_phone}</span>
              </div>
            )}
            {order.customer_email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{order.customer_email}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {order.delivery_date && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Entrega: {format(new Date(order.delivery_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
            )}
            {order.delivery_address && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-2">{order.delivery_address}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-3">
          <p className="text-sm font-medium mb-2">Itens do Pedido:</p>
          <div className="space-y-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">
                  R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2 border-t mt-2">
            <span className="font-semibold">Total</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              R$ {order.total_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-medium">Status do Pedido</label>
            <Select
              value={order.status || 'pendente'}
              onValueChange={(value) => onStatusChange(order.id, value, order.payment_status || undefined)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="em_preparacao">Em Preparação</SelectItem>
                <SelectItem value="pronto">Pronto</SelectItem>
                <SelectItem value="em_entrega">Em Entrega</SelectItem>
                <SelectItem value="entregue">Entregue</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Status do Pagamento</label>
            <Select
              value={order.payment_status || 'pendente'}
              onValueChange={(value) => onStatusChange(order.id, order.status || 'pendente', value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="estornado">Estornado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {order.notes && (
          <div className="pt-2 text-sm">
            <p className="font-medium">Observações:</p>
            <p className="text-muted-foreground">{order.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

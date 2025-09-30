import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, DollarSign, TrendingUp, TrendingDown, Clock, Truck, ShoppingCart, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, RefreshCw, User, ChartBar as BarChart3 } from "lucide-react";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: 'stock_in' | 'stock_out' | 'price_change' | 'reorder' | 'adjustment' | 'sale' | 'return';
  title: string;
  description: string;
  date: Date;
  quantity?: number;
  value?: number;
  user?: string;
  reference?: string;
}

interface PartsTimelineProps {
  partId: string;
  events?: TimelineEvent[];
}

export const PartsTimeline = ({ partId, events }: PartsTimelineProps) => {
  // Mock timeline events - in real app would fetch from database
  const mockEvents: TimelineEvent[] = [
    {
      id: '1',
      type: 'sale',
      title: 'Venda realizada',
      description: 'Peça vendida na ordem de serviço #OS-001',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      quantity: -2,
      value: 71.80,
      user: 'Carlos (Mecânico)',
      reference: 'OS-001'
    },
    {
      id: '2',
      type: 'stock_in',
      title: 'Entrada de estoque',
      description: 'Recebimento de mercadoria do fornecedor ABC',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      quantity: 20,
      value: 518.00,
      user: 'Maria (Estoque)',
      reference: 'NF-12345'
    },
    {
      id: '3',
      type: 'price_change',
      title: 'Atualização de preço',
      description: 'Preço de venda atualizado conforme tabela do fornecedor',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      value: 35.90,
      user: 'João (Gerente)',
      reference: 'Tabela-2024-Q4'
    },
    {
      id: '4',
      type: 'adjustment',
      title: 'Ajuste de estoque',
      description: 'Correção após inventário físico',
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      quantity: -1,
      user: 'Maria (Estoque)',
      reference: 'INV-2024-001'
    },
    {
      id: '5',
      type: 'reorder',
      title: 'Pedido de reposição',
      description: 'Solicitação de compra enviada ao fornecedor',
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      quantity: 25,
      value: 647.50,
      user: 'João (Gerente)',
      reference: 'PC-2024-089'
    },
    {
      id: '6',
      type: 'return',
      title: 'Devolução de cliente',
      description: 'Peça devolvida por defeito de fabricação',
      date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      quantity: 1,
      value: -35.90,
      user: 'Ana (Atendimento)',
      reference: 'DEV-001'
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'stock_in':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'stock_out':
        return <TrendingDown className="h-4 w-4 text-warning" />;
      case 'sale':
        return <ShoppingCart className="h-4 w-4 text-primary" />;
      case 'price_change':
        return <DollarSign className="h-4 w-4 text-info" />;
      case 'reorder':
        return <Truck className="h-4 w-4 text-purple" />;
      case 'adjustment':
        return <RefreshCw className="h-4 w-4 text-orange" />;
      case 'return':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'stock_in':
        return 'border-success bg-success/5';
      case 'stock_out':
        return 'border-warning bg-warning/5';
      case 'sale':
        return 'border-primary bg-primary/5';
      case 'price_change':
        return 'border-info bg-info/5';
      case 'reorder':
        return 'border-purple bg-purple/5';
      case 'adjustment':
        return 'border-orange bg-orange/5';
      case 'return':
        return 'border-destructive bg-destructive/5';
      default:
        return 'border-muted bg-muted/5';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'stock_in': return 'Entrada';
      case 'stock_out': return 'Saída';
      case 'sale': return 'Venda';
      case 'price_change': return 'Preço';
      case 'reorder': return 'Reposição';
      case 'adjustment': return 'Ajuste';
      case 'return': return 'Devolução';
      default: return 'Evento';
    }
  };

  const getQuantityDisplay = (quantity: number | undefined, type: string) => {
    if (!quantity) return null;
    
    const isPositive = quantity > 0;
    const color = isPositive ? 'text-success' : 'text-warning';
    const sign = isPositive ? '+' : '';
    
    return (
      <Badge variant="outline" className={cn("text-xs", color)}>
        {sign}{quantity} un.
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Histórico de Movimentações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockEvents.map((event, index) => (
            <div key={event.id} className="flex gap-4 relative">
              {/* Timeline line */}
              {index < mockEvents.length - 1 && (
                <div className="absolute left-6 top-12 w-px h-16 bg-border" />
              )}
              
              {/* Event icon */}
              <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full border-2 shrink-0",
                getEventColor(event.type)
              )}>
                {getEventIcon(event.type)}
              </div>
              
              {/* Event content */}
              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {getEventTypeLabel(event.type)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.quantity && getQuantityDisplay(event.quantity, event.type)}
                    {event.value && (
                      <Badge variant="outline" className="text-xs">
                        {formatCurrency(Math.abs(event.value))}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {event.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(event.date)}</span>
                    <span>•</span>
                    <span>{event.date.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</span>
                  </div>
                  {event.user && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{event.user}</span>
                    </div>
                  )}
                  {event.reference && (
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      <span>{event.reference}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {mockEvents.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhuma movimentação registrada ainda
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
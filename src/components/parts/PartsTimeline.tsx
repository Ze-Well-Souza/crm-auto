import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, DollarSign, TrendingUp, TrendingDown, Clock, Truck, ShoppingCart, TriangleAlert as AlertTriangle, RefreshCw, User, ChartBar as BarChart3 } from "lucide-react";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { usePartsTimeline } from "@/hooks/usePartsTimeline";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface PartsTimelineProps {
  partId: string;
}

export const PartsTimeline = ({ partId }: PartsTimelineProps) => {
  const { events, loading, error } = usePartsTimeline(partId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Histórico de Movimentações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Histórico de Movimentações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

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
          {events.map((event, index) => (
            <div key={event.id} className="flex gap-4 relative">
              {/* Timeline line */}
              {index < events.length - 1 && (
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
          
          {events.length === 0 && (
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
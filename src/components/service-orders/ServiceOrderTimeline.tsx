import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Wrench, DollarSign, Clock, Play as PlayCircle, FileText, User, Settings, MessageCircle } from "lucide-react";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { useServiceOrderTimeline } from "@/hooks/useServiceOrderTimeline";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface ServiceOrderTimelineProps {
  serviceOrderId: string;
}

export const ServiceOrderTimeline = ({ serviceOrderId }: ServiceOrderTimelineProps) => {
  const { events, loading, error } = useServiceOrderTimeline(serviceOrderId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timeline da Ordem de Serviço
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
            <Clock className="h-5 w-5" />
            Timeline da Ordem de Serviço
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
      case 'status_change':
        return <PlayCircle className="h-4 w-4 text-primary" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-success" />;
      case 'communication':
        return <MessageCircle className="h-4 w-4 text-info" />;
      case 'part_added':
        return <Settings className="h-4 w-4 text-warning" />;
      case 'labor_added':
        return <Wrench className="h-4 w-4 text-purple" />;
      case 'note':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'status_change':
        return 'border-primary bg-primary/5';
      case 'payment':
        return 'border-success bg-success/5';
      case 'communication':
        return 'border-info bg-info/5';
      case 'part_added':
        return 'border-warning bg-warning/5';
      case 'labor_added':
        return 'border-purple bg-purple/5';
      case 'note':
        return 'border-muted bg-muted/5';
      default:
        return 'border-muted bg-muted/5';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'status_change': return 'Mudança de Status';
      case 'payment': return 'Pagamento';
      case 'communication': return 'Comunicação';
      case 'part_added': return 'Peça Adicionada';
      case 'labor_added': return 'Mão de Obra';
      case 'note': return 'Observação';
      default: return 'Evento';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Timeline da Ordem de Serviço
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
                    {event.value && (
                      <Badge variant="outline" className="text-xs">
                        {formatCurrency(event.value)}
                      </Badge>
                    )}
                    {event.status && (
                      <Badge 
                        variant={
                          event.status === 'concluido' || event.status === 'aprovado' || event.status === 'pago' 
                            ? 'default' 
                            : 'secondary'
                        } 
                        className="text-xs"
                      >
                        {event.status}
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
                </div>
              </div>
            </div>
          ))}
          
          {events.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhum evento registrado ainda
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
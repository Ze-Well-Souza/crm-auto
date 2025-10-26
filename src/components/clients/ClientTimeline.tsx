import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  DollarSign, 
  Phone, 
  Wrench,
  Clock
} from "lucide-react";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { useClientTimeline } from "@/hooks/useClientTimeline";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface ClientTimelineProps {
  clientId: string;
}

export const ClientTimeline = ({ clientId }: ClientTimelineProps) => {
  const { events, loading, error } = useClientTimeline(clientId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Interações
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
            Histórico de Interações
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
      case 'service':
        return <Wrench className="h-4 w-4 text-primary" />;
      case 'appointment':
        return <Calendar className="h-4 w-4 text-info" />;
      case 'contact':
        return <Phone className="h-4 w-4 text-success" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'service':
        return 'border-primary bg-primary/5';
      case 'appointment':
        return 'border-info bg-info/5';
      case 'contact':
        return 'border-success bg-success/5';
      case 'payment':
        return 'border-warning bg-warning/5';
      default:
        return 'border-muted bg-muted/5';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Histórico de Interações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="flex gap-4 relative">
              {/* Timeline line */}
              {index < events.length - 1 && (
                <div className="absolute left-6 top-12 w-px h-8 bg-border" />
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
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <div className="flex items-center gap-2">
                    {event.value && (
                      <Badge variant="outline" className="text-xs">
                        {formatCurrency(event.value)}
                      </Badge>
                    )}
                    {event.status && (
                      <Badge variant="secondary" className="text-xs">
                        {event.status}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {event.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(event.date)}</span>
                  <span>•</span>
                  <span>{event.date.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>
              </div>
            </div>
          ))}
          
          {events.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhuma interação registrada ainda
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
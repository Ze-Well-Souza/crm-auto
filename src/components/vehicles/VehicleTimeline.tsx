import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Wrench, DollarSign, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Settings, FileText } from "lucide-react";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { useVehicleTimeline } from "@/hooks/useVehicleTimeline";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface VehicleTimelineProps {
  vehicleId: string;
}

export const VehicleTimeline = ({ vehicleId }: VehicleTimelineProps) => {
  const { events, loading, error } = useVehicleTimeline(vehicleId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico Completo do Veículo
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
            Histórico Completo do Veículo
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
      case 'maintenance':
        return <Settings className="h-4 w-4 text-info" />;
      case 'repair':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'inspection':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'document':
        return <FileText className="h-4 w-4 text-purple" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'service':
        return 'border-primary bg-primary/5';
      case 'maintenance':
        return 'border-info bg-info/5';
      case 'repair':
        return 'border-warning bg-warning/5';
      case 'inspection':
        return 'border-success bg-success/5';
      case 'document':
        return 'border-purple bg-purple/5';
      default:
        return 'border-muted bg-muted/5';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'service': return 'Serviço';
      case 'maintenance': return 'Manutenção';
      case 'repair': return 'Reparo';
      case 'inspection': return 'Inspeção';
      case 'document': return 'Documento';
      default: return 'Evento';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Histórico Completo do Veículo
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
                    {event.mileage && (
                      <Badge variant="secondary" className="text-xs">
                        {event.mileage.toLocaleString('pt-BR')} km
                      </Badge>
                    )}
                    {event.status && (
                      <Badge 
                        variant={event.status === 'concluido' || event.status === 'aprovado' || event.status === 'pago' ? 'default' : 'secondary'} 
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
                  </div>
                  {event.mileage && (
                    <div className="flex items-center gap-1">
                      <Settings className="h-3 w-3" />
                      <span>{event.mileage.toLocaleString('pt-BR')} km</span>
                    </div>
                  )}
                  {event.value && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{formatCurrency(event.value)}</span>
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
                Nenhum histórico registrado ainda
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
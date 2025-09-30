import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Wrench, DollarSign, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Fuel, Settings, FileText } from "lucide-react";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: 'service' | 'maintenance' | 'repair' | 'inspection' | 'document';
  title: string;
  description: string;
  date: Date;
  value?: number;
  mileage?: number;
  status?: string;
}

interface VehicleTimelineProps {
  vehicleId: string;
  events?: TimelineEvent[];
}

export const VehicleTimeline = ({ vehicleId, events }: VehicleTimelineProps) => {
  // Mock timeline events - in real app would fetch from database
  const mockEvents: TimelineEvent[] = [
    {
      id: '1',
      type: 'service',
      title: 'Troca de óleo e filtros',
      description: 'Manutenção preventiva realizada conforme programação',
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      value: 180.00,
      mileage: 45000,
      status: 'concluido'
    },
    {
      id: '2',
      type: 'repair',
      title: 'Reparo no sistema de freios',
      description: 'Substituição de pastilhas e discos de freio dianteiros',
      date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      value: 450.00,
      mileage: 42000,
      status: 'concluido'
    },
    {
      id: '3',
      type: 'inspection',
      title: 'Inspeção veicular',
      description: 'Inspeção anual obrigatória aprovada',
      date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      value: 85.00,
      mileage: 38000,
      status: 'aprovado'
    },
    {
      id: '4',
      type: 'maintenance',
      title: 'Revisão dos 40.000 km',
      description: 'Revisão completa conforme manual do fabricante',
      date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      value: 650.00,
      mileage: 40000,
      status: 'concluido'
    },
    {
      id: '5',
      type: 'document',
      title: 'Renovação do IPVA',
      description: 'IPVA 2024 pago em dia',
      date: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000),
      value: 1200.00,
      status: 'pago'
    }
  ];

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
          
          {mockEvents.length === 0 && (
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
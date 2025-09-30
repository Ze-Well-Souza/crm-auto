import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar, 
  Car, 
  DollarSign, 
  Phone, 
  Mail, 
  MessageCircle,
  Wrench,
  Clock
} from "lucide-react";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: 'service' | 'appointment' | 'contact' | 'payment' | 'note';
  title: string;
  description: string;
  date: Date;
  value?: number;
  status?: string;
}

interface ClientTimelineProps {
  clientId: string;
  events?: TimelineEvent[];
}

export const ClientTimeline = ({ clientId, events }: ClientTimelineProps) => {
  // Mock timeline events - in real app would fetch from database
  const mockEvents: TimelineEvent[] = [
    {
      id: '1',
      type: 'service',
      title: 'Troca de óleo realizada',
      description: 'Serviço de troca de óleo e filtros concluído',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      value: 150.00,
      status: 'concluido'
    },
    {
      id: '2',
      type: 'contact',
      title: 'Ligação realizada',
      description: 'Cliente contatado para agendamento de revisão',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      type: 'appointment',
      title: 'Agendamento criado',
      description: 'Revisão dos 60.000 km agendada',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      value: 450.00,
      status: 'agendado'
    },
    {
      id: '4',
      type: 'payment',
      title: 'Pagamento recebido',
      description: 'Pagamento da ordem de serviço #OS-001',
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      value: 280.00,
      status: 'pago'
    }
  ];

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
          {mockEvents.map((event, index) => (
            <div key={event.id} className="flex gap-4 relative">
              {/* Timeline line */}
              {index < mockEvents.length - 1 && (
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
          
          {mockEvents.length === 0 && (
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
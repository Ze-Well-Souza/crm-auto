// Reusable status badge component with consistent styling
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { AppointmentStatus, ServiceOrderStatus, TransactionStatus } from "@/types";

interface StatusBadgeProps {
  status: string | null;
  type: 'appointment' | 'service-order' | 'transaction';
  showIcon?: boolean;
}

export const StatusBadge = ({ status, type, showIcon = true }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    if (type === 'appointment') {
      switch (status) {
        case AppointmentStatus.AGENDADO:
          return { 
            variant: 'secondary' as const, 
            label: 'Agendado', 
            icon: Clock,
            color: 'text-warning'
          };
        case AppointmentStatus.CONFIRMADO:
          return { 
            variant: 'default' as const, 
            label: 'Confirmado', 
            icon: CheckCircle,
            color: 'text-primary'
          };
        case AppointmentStatus.EM_ANDAMENTO:
          return { 
            variant: 'secondary' as const, 
            label: 'Em Andamento', 
            icon: Clock,
            color: 'text-info'
          };
        case AppointmentStatus.CONCLUIDO:
          return { 
            variant: 'default' as const, 
            label: 'Concluído', 
            icon: CheckCircle,
            color: 'text-success'
          };
        case AppointmentStatus.CANCELADO:
          return { 
            variant: 'destructive' as const, 
            label: 'Cancelado', 
            icon: XCircle,
            color: 'text-destructive'
          };
        default:
          return { 
            variant: 'outline' as const, 
            label: 'Pendente', 
            icon: AlertCircle,
            color: 'text-muted-foreground'
          };
      }
    }

    if (type === 'transaction') {
      switch (status) {
        case TransactionStatus.PAGO:
          return { 
            variant: 'default' as const, 
            label: 'Pago', 
            icon: CheckCircle,
            color: 'text-success'
          };
        case TransactionStatus.PENDENTE:
          return { 
            variant: 'secondary' as const, 
            label: 'Pendente', 
            icon: Clock,
            color: 'text-warning'
          };
        case TransactionStatus.VENCIDO:
          return { 
            variant: 'destructive' as const, 
            label: 'Vencido', 
            icon: AlertCircle,
            color: 'text-destructive'
          };
        case TransactionStatus.CANCELADO:
          return { 
            variant: 'destructive' as const, 
            label: 'Cancelado', 
            icon: XCircle,
            color: 'text-destructive'
          };
        default:
          return { 
            variant: 'outline' as const, 
            label: 'Pendente', 
            icon: AlertCircle,
            color: 'text-muted-foreground'
          };
      }
    }

    // Default for service orders
    return { 
      variant: 'outline' as const, 
      label: status || 'Pendente', 
      icon: AlertCircle,
      color: 'text-muted-foreground'
    };
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      {showIcon && <IconComponent className={`h-4 w-4 ${config.color}`} />}
      {config.label}
    </Badge>
  );
};
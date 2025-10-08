import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: string | null;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const getStatusConfig = (status: string | null) => {
    switch (status) {
      case 'pendente':
        return { label: 'Pendente', className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' };
      case 'confirmado':
        return { label: 'Confirmado', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' };
      case 'em_preparacao':
        return { label: 'Em Preparação', className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' };
      case 'pronto':
        return { label: 'Pronto', className: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' };
      case 'em_entrega':
        return { label: 'Em Entrega', className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' };
      case 'entregue':
        return { label: 'Entregue', className: 'bg-green-500/10 text-green-600 dark:text-green-400' };
      case 'cancelado':
        return { label: 'Cancelado', className: 'bg-red-500/10 text-red-600 dark:text-red-400' };
      default:
        return { label: 'Pendente', className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
};

import { Partner } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PartnerActions } from './PartnerActions';
import { Store, Mail, Phone, MapPin, Star } from 'lucide-react';

interface PartnerCardProps {
  partner: Partner;
  onEdit: () => void;
  onDelete: () => void;
}

export const PartnerCard = ({ partner, onEdit, onDelete }: PartnerCardProps) => {
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'pendente':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
      case 'inativo':
        return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: string | null) => {
    return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Store className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{partner.name}</h3>
              {partner.category && (
                <Badge variant="secondary" className={getCategoryColor(partner.category)}>
                  {partner.category}
                </Badge>
              )}
            </div>
          </div>
          <PartnerActions partner={partner} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(partner.status)}>
            {partner.status || 'pendente'}
          </Badge>
          {partner.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">{partner.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          {partner.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="truncate">{partner.email}</span>
            </div>
          )}
          {partner.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{partner.phone}</span>
            </div>
          )}
          {partner.city && partner.state && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{partner.city}/{partner.state}</span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t flex justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Pedidos</p>
            <p className="font-semibold">{partner.orders_count || 0}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Faturamento</p>
            <p className="font-semibold text-green-600 dark:text-green-400">
              R$ {(partner.total_revenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

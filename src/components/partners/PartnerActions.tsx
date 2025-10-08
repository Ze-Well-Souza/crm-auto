import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Partner } from '@/types';

interface PartnerActionsProps {
  partner: Partner;
  onEdit: () => void;
  onDelete: () => void;
}

export const PartnerActions = ({ partner, onEdit, onDelete }: PartnerActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="gap-2 text-red-600">
          <Trash2 className="h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

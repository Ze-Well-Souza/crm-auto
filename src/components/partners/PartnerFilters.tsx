import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PartnerFiltersProps {
  onFilterChange: (filters: any) => void;
}

export const PartnerFilters = ({ onFilterChange }: PartnerFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [minRating, setMinRating] = useState<string>('');

  const handleApplyFilters = () => {
    onFilterChange({
      category: category || undefined,
      status: status || undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
    });
  };

  const handleClearFilters = () => {
    setCategory('');
    setStatus('');
    setMinRating('');
    onFilterChange({});
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros Avançados
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4">
        <div className="p-4 border rounded-lg bg-card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="restaurante">Restaurante</SelectItem>
                  <SelectItem value="lanchonete">Lanchonete</SelectItem>
                  <SelectItem value="pizzaria">Pizzaria</SelectItem>
                  <SelectItem value="hamburgueria">Hamburgueria</SelectItem>
                  <SelectItem value="padaria">Padaria</SelectItem>
                  <SelectItem value="mercado">Mercado</SelectItem>
                  <SelectItem value="farmacia">Farmácia</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Avaliação Mínima</label>
              <Select value={minRating} onValueChange={setMinRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Qualquer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Qualquer</SelectItem>
                  <SelectItem value="4">4+ estrelas</SelectItem>
                  <SelectItem value="3">3+ estrelas</SelectItem>
                  <SelectItem value="2">2+ estrelas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar
            </Button>
            <Button onClick={handleApplyFilters}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

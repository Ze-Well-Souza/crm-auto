import { useState } from "react";
import { Search, Filter, X, Mail, Clock, Star, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ClientFilterOptions {
  searchQuery: string;
  showVIP: boolean;
  showNew: boolean;
  showWithEmail: boolean;
  showRecent: boolean;
}

interface ClientFiltersAdvancedProps {
  filters: ClientFilterOptions;
  onFiltersChange: (filters: ClientFilterOptions) => void;
  totalResults: number;
}

export const ClientFiltersAdvanced = ({ filters, onFiltersChange, totalResults }: ClientFiltersAdvancedProps) => {
  const [localSearch, setLocalSearch] = useState(filters.searchQuery);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const toggleFilter = (key: keyof Omit<ClientFilterOptions, 'searchQuery'>) => {
    onFiltersChange({ ...filters, [key]: !filters[key] });
  };

  const clearAllFilters = () => {
    setLocalSearch('');
    onFiltersChange({
      searchQuery: '',
      showVIP: false,
      showNew: false,
      showWithEmail: false,
      showRecent: false
    });
  };

  const activeFiltersCount = [
    filters.showVIP,
    filters.showNew,
    filters.showWithEmail,
    filters.showRecent
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0 || filters.searchQuery.length > 0;

  return (
    <div className="space-y-4">
      {/* Barra de Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome, email, telefone ou CPF/CNPJ..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {localSearch && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Botão de Filtros Avançados */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuCheckboxItem
              checked={filters.showVIP}
              onCheckedChange={() => toggleFilter('showVIP')}
            >
              <Star className="h-4 w-4 mr-2 text-yellow-600" />
              Apenas VIP
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={filters.showNew}
              onCheckedChange={() => toggleFilter('showNew')}
            >
              <Users className="h-4 w-4 mr-2 text-blue-600" />
              Apenas Novos
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={filters.showWithEmail}
              onCheckedChange={() => toggleFilter('showWithEmail')}
            >
              <Mail className="h-4 w-4 mr-2 text-purple-600" />
              Com Email
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={filters.showRecent}
              onCheckedChange={() => toggleFilter('showRecent')}
            >
              <Clock className="h-4 w-4 mr-2 text-green-600" />
              Recentes (7 dias)
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Botão Limpar Filtros */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>

      {/* Tags Rápidas */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={filters.showWithEmail ? "default" : "outline"}
          className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
          onClick={() => toggleFilter('showWithEmail')}
        >
          <Mail className="h-3 w-3 mr-1" />
          Com Email
        </Badge>
        
        <Badge
          variant={filters.showRecent ? "default" : "outline"}
          className="cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
          onClick={() => toggleFilter('showRecent')}
        >
          <Clock className="h-3 w-3 mr-1" />
          Recentes
        </Badge>
        
        <Badge
          variant={filters.showVIP ? "default" : "outline"}
          className="cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
          onClick={() => toggleFilter('showVIP')}
        >
          <Star className="h-3 w-3 mr-1" />
          VIP
        </Badge>
        
        <Badge variant="secondary" className="pointer-events-none">
          {totalResults} {totalResults === 1 ? 'resultado' : 'resultados'}
        </Badge>
      </div>
    </div>
  );
};


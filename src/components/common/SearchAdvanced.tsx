import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  ChevronDown,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Tipos para configuração de filtros
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'checkbox' | 'date-range' | 'number-range';
  options?: FilterOption[];
  placeholder?: string;
}

export interface QuickFilter {
  key: string;
  label: string;
  icon?: React.ReactNode;
  color?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline';
}

export interface SearchFilters {
  query?: string;
  [key: string]: any;
}

interface SearchAdvancedProps {
  placeholder?: string;
  filterGroups?: FilterGroup[];
  quickFilters?: QuickFilter[];
  onSearch: (filters: SearchFilters) => void;
  onReset?: () => void;
  debounceMs?: number;
  showQuickFilters?: boolean;
  showAdvancedFilters?: boolean;
  className?: string;
}

export const SearchAdvanced = ({
  placeholder = "Buscar...",
  filterGroups = [],
  quickFilters = [],
  onSearch,
  onReset,
  debounceMs = 300,
  showQuickFilters = true,
  showAdvancedFilters = true,
  className
}: SearchAdvancedProps) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [activeQuickFilters, setActiveQuickFilters] = useState<Set<string>>(new Set());
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateRanges, setDateRanges] = useState<Record<string, { from?: Date; to?: Date }>>({});

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchFilters: SearchFilters) => {
      onSearch(searchFilters);
    }, debounceMs),
    [onSearch, debounceMs]
  );

  // Effect para busca em tempo real
  useEffect(() => {
    const searchFilters: SearchFilters = {
      query: query.trim() || undefined,
      ...filters,
      ...Object.fromEntries(
        Array.from(activeQuickFilters).map(key => [key, true])
      ),
      ...Object.fromEntries(
        Object.entries(dateRanges).map(([key, range]) => [
          key,
          range.from && range.to ? { from: range.from, to: range.to } : undefined
        ]).filter(([, value]) => value !== undefined)
      )
    };

    debouncedSearch(searchFilters);
  }, [query, filters, activeQuickFilters, dateRanges, debouncedSearch]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleQuickFilterToggle = (key: string) => {
    setActiveQuickFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleDateRangeChange = (key: string, range: { from?: Date; to?: Date }) => {
    setDateRanges(prev => ({
      ...prev,
      [key]: range
    }));
  };

  const handleReset = () => {
    setQuery("");
    setFilters({});
    setActiveQuickFilters(new Set());
    setDateRanges({});
    setShowAdvanced(false);
    onReset?.();
  };

  const getActiveFiltersCount = () => {
    const filtersCount = Object.values(filters).filter(Boolean).length;
    const quickFiltersCount = activeQuickFilters.size;
    const dateRangesCount = Object.values(dateRanges).filter(range => range.from && range.to).length;
    return filtersCount + quickFiltersCount + dateRangesCount;
  };

  const renderFilterGroup = (group: FilterGroup) => {
    switch (group.type) {
      case 'select':
        return (
          <div key={group.key} className="space-y-2">
            <Label>{group.label}</Label>
            <Select
              value={filters[group.key] || ""}
              onValueChange={(value) => handleFilterChange(group.key, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={group.placeholder || `Selecionar ${group.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {group.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      {option.count !== undefined && (
                        <Badge variant="secondary" className="ml-2">
                          {option.count}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'multiselect':
        const selectedValues = filters[group.key] || [];
        return (
          <div key={group.key} className="space-y-2">
            <Label>{group.label}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedValues.length > 0 
                    ? `${selectedValues.length} selecionado(s)`
                    : group.placeholder || `Selecionar ${group.label.toLowerCase()}`
                  }
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <div className="p-4 space-y-2">
                  {group.options?.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${group.key}-${option.value}`}
                        checked={selectedValues.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const newValues = checked
                            ? [...selectedValues, option.value]
                            : selectedValues.filter((v: string) => v !== option.value);
                          handleFilterChange(group.key, newValues.length > 0 ? newValues : undefined);
                        }}
                      />
                      <Label htmlFor={`${group.key}-${option.value}`} className="flex-1">
                        {option.label}
                        {option.count !== undefined && (
                          <Badge variant="secondary" className="ml-2">
                            {option.count}
                          </Badge>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );

      case 'date-range':
        const dateRange = dateRanges[group.key] || {};
        return (
          <div key={group.key} className="space-y-2">
            <Label>{group.label}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecionar período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range) => handleDateRangeChange(group.key, range || {})}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case 'number-range':
        const numberRange = filters[group.key] || {};
        return (
          <div key={group.key} className="space-y-2">
            <Label>{group.label}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Mín"
                value={numberRange.min || ""}
                onChange={(e) => handleFilterChange(group.key, {
                  ...numberRange,
                  min: e.target.value ? Number(e.target.value) : undefined
                })}
              />
              <Input
                type="number"
                placeholder="Máx"
                value={numberRange.max || ""}
                onChange={(e) => handleFilterChange(group.key, {
                  ...numberRange,
                  max: e.target.value ? Number(e.target.value) : undefined
                })}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Barra de busca principal */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={handleQueryChange}
            className="pl-10"
          />
        </div>
        
        {showAdvancedFilters && (
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "flex items-center gap-2",
              (showAdvanced || getActiveFiltersCount() > 0) && "bg-primary/10"
            )}
          >
            <Filter className="h-4 w-4" />
            Filtros
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        )}

        {getActiveFiltersCount() > 0 && (
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filtros rápidos */}
      {showQuickFilters && quickFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <Badge
              key={filter.key}
              variant={activeQuickFilters.has(filter.key) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => handleQuickFilterToggle(filter.key)}
            >
              {filter.icon && <span className="mr-1">{filter.icon}</span>}
              {filter.label}
            </Badge>
          ))}
        </div>
      )}

      {/* Filtros avançados */}
      {showAdvanced && showAdvancedFilters && filterGroups.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filtros Avançados</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterGroups.map(renderFilterGroup)}
            </div>
            
            {getActiveFiltersCount() > 0 && (
              <>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {getActiveFiltersCount()} filtro(s) ativo(s)
                  </span>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Limpar filtros
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
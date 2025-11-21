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
  placeholder?: string | { min?: string; max?: string; start?: string; end?: string };
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
        const selectPlaceholder = typeof group.placeholder === 'string' ? group.placeholder : `Selecionar ${group.label.toLowerCase()}`;
        return (
          <div key={group.key} className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300">{group.label}</Label>
            <Select
              value={filters[group.key] || ""}
              onValueChange={(value) => handleFilterChange(group.key, value)}
            >
              <SelectTrigger className="bg-white dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10">
                <SelectValue placeholder={selectPlaceholder} />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10">
                {group.options?.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-white/10 focus:text-slate-900 dark:focus:text-white"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      {option.count !== undefined && (
                        <Badge className="ml-2 bg-purple-500/20 text-purple-300 border-purple-500/30">
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
        const multiselectPlaceholder = typeof group.placeholder === 'string' ? group.placeholder : `Selecionar ${group.label.toLowerCase()}`;
        return (
          <div key={group.key} className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300">{group.label}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  {selectedValues.length > 0
                    ? `${selectedValues.length} selecionado(s)`
                    : multiselectPlaceholder
                  }
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-slate-900 border-white/10">
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
                        className="border-white/20 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <Label htmlFor={`${group.key}-${option.value}`} className="flex-1 text-slate-300">
                        {option.label}
                        {option.count !== undefined && (
                          <Badge className="ml-2 bg-purple-500/20 text-purple-300 border-purple-500/30">
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
            <Label className="text-slate-700 dark:text-slate-300">{group.label}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-purple-400" />
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
                    <span className="text-slate-400">Selecionar período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange.from && dateRange.to ? { from: dateRange.from, to: dateRange.to } : undefined}
                  onSelect={(range) => handleDateRangeChange(group.key, range || { from: undefined, to: undefined })}
                  numberOfMonths={2}
                  locale={ptBR}
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case 'number-range':
        const numberRange = filters[group.key] || {};
        return (
          <div key={group.key} className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300">{group.label}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Mín"
                value={numberRange.min || ""}
                onChange={(e) => handleFilterChange(group.key, {
                  ...numberRange,
                  min: e.target.value ? Number(e.target.value) : undefined
                })}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
              />
              <Input
                type="number"
                placeholder="Máx"
                value={numberRange.max || ""}
                onChange={(e) => handleFilterChange(group.key, {
                  ...numberRange,
                  max: e.target.value ? Number(e.target.value) : undefined
                })}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
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
      {/* Barra de busca principal - Landing Page Style */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
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
              "flex items-center gap-2 bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white",
              (showAdvanced || getActiveFiltersCount() > 0) && "bg-purple-500/20 border-purple-500/30 text-purple-300"
            )}
          >
            <Filter className="h-4 w-4" />
            Filtros
            {getActiveFiltersCount() > 0 && (
              <Badge className="ml-1 bg-purple-500/30 text-purple-200 border-purple-500/50">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        )}

        {getActiveFiltersCount() > 0 && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className=""
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filtros rápidos - Landing Page Style */}
      {showQuickFilters && quickFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <Badge
              key={filter.key}
              className={cn(
                "cursor-pointer transition-all duration-300 px-4 py-2",
                activeQuickFilters.has(filter.key)
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg shadow-purple-500/50"
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
              )}
              onClick={() => handleQuickFilterToggle(filter.key)}
            >
              {filter.icon && <span className="mr-1">{filter.icon}</span>}
              {filter.label}
            </Badge>
          ))}
        </div>
      )}

      {/* Filtros avançados - Landing Page Style */}
      {showAdvanced && showAdvancedFilters && filterGroups.length > 0 && (
        <Card className="bg-white/80 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 backdrop-blur-xl shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Filtros Avançados
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(false)}
                className="text-slate-300 hover:text-white hover:bg-white/10"
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
                <Separator className="bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">
                    {getActiveFiltersCount()} filtro(s) ativo(s)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className=""
                  >
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

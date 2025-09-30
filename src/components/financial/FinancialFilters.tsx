import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Filter, X, Calendar, DollarSign, CreditCard, Tag, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

export interface FinancialFiltersState {
  type: string[];
  status: string[];
  category: string[];
  paymentMethod: string[];
  amountRange: [number, number];
  dateRange: string;
  quickFilters: string[];
}

interface FinancialFiltersProps {
  filters: FinancialFiltersState;
  onFiltersChange: (filters: FinancialFiltersState) => void;
  categories?: string[];
  paymentMethods?: string[];
}

export const FinancialFilters = ({ 
  filters, 
  onFiltersChange, 
  categories = [],
  paymentMethods = []
}: FinancialFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amountRange, setAmountRange] = useState<[number, number]>(filters.amountRange);

  const quickFilters = [
    { id: 'pending', label: 'Pendentes', icon: Clock, color: 'text-warning' },
    { id: 'overdue', label: 'Vencidas', icon: Clock, color: 'text-destructive' },
    { id: 'paid', label: 'Pagas', icon: TrendingUp, color: 'text-success' },
    { id: 'high-value', label: 'Alto Valor', icon: DollarSign, color: 'text-primary' },
    { id: 'this-month', label: 'Este Mês', icon: Calendar, color: 'text-info' },
    { id: 'revenue', label: 'Receitas', icon: TrendingUp, color: 'text-success' },
    { id: 'expense', label: 'Despesas', icon: TrendingDown, color: 'text-destructive' }
  ];

  const typeOptions = [
    { value: 'receita', label: 'Receita' },
    { value: 'despesa', label: 'Despesa' }
  ];

  const statusOptions = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'pago', label: 'Pago' },
    { value: 'vencido', label: 'Vencido' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mês' },
    { value: 'quarter', label: 'Este Trimestre' },
    { value: 'year', label: 'Este Ano' },
    { value: 'all', label: 'Todos os Períodos' }
  ];

  const updateFilters = (updates: Partial<FinancialFiltersState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleQuickFilter = (filterId: string) => {
    const newQuickFilters = filters.quickFilters.includes(filterId)
      ? filters.quickFilters.filter(f => f !== filterId)
      : [...filters.quickFilters, filterId];
    updateFilters({ quickFilters: newQuickFilters });
  };

  const toggleArrayFilter = (key: keyof FinancialFiltersState, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilters({ [key]: newArray });
  };

  const clearFilters = () => {
    onFiltersChange({
      type: [],
      status: [],
      category: [],
      paymentMethod: [],
      amountRange: [0, 10000],
      dateRange: 'all',
      quickFilters: []
    });
    setAmountRange([0, 10000]);
  };

  const getActiveFiltersCount = () => {
    return (
      filters.type.length +
      filters.status.length +
      filters.category.length +
      filters.paymentMethod.length +
      filters.quickFilters.length +
      (filters.dateRange !== 'all' ? 1 : 0) +
      (filters.amountRange[0] > 0 || filters.amountRange[1] < 10000 ? 1 : 0)
    );
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => {
          const Icon = filter.icon;
          const isActive = filters.quickFilters.includes(filter.id);
          return (
            <Button
              key={filter.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => toggleQuickFilter(filter.id)}
              className="h-8"
            >
              <Icon className={`h-3 w-3 mr-1 ${isActive ? 'text-white' : filter.color}`} />
              {filter.label}
            </Button>
          );
        })}
      </div>

      {/* Advanced Filters */}
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-3 w-3 mr-1" />
              Filtros Avançados
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  Filtros Avançados
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-6 px-2 text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Limpar
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type Filter */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Tipo</Label>
                  <div className="space-y-2">
                    {typeOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${option.value}`}
                          checked={filters.type.includes(option.value)}
                          onCheckedChange={() => toggleArrayFilter('type', option.value)}
                        />
                        <Label htmlFor={`type-${option.value}`} className="text-xs">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Status</Label>
                  <div className="space-y-2">
                    {statusOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${option.value}`}
                          checked={filters.status.includes(option.value)}
                          onCheckedChange={() => toggleArrayFilter('status', option.value)}
                        />
                        <Label htmlFor={`status-${option.value}`} className="text-xs">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Category Filter */}
                {categories.length > 0 && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Categoria</Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={filters.category.includes(category)}
                              onCheckedChange={() => toggleArrayFilter('category', category)}
                            />
                            <Label htmlFor={`category-${category}`} className="text-xs">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Payment Method Filter */}
                {paymentMethods.length > 0 && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Método de Pagamento</Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {paymentMethods.map((method) => (
                          <div key={method} className="flex items-center space-x-2">
                            <Checkbox
                              id={`payment-${method}`}
                              checked={filters.paymentMethod.includes(method)}
                              onCheckedChange={() => toggleArrayFilter('paymentMethod', method)}
                            />
                            <Label htmlFor={`payment-${method}`} className="text-xs">
                              {method}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Date Range Filter */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Período</Label>
                  <Select value={filters.dateRange} onValueChange={(value) => updateFilters({ dateRange: value })}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRangeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Amount Range Filter */}
                <div className="space-y-3">
                  <Label className="text-xs font-medium">Faixa de Valor</Label>
                  <div className="px-2">
                    <Slider
                      value={amountRange}
                      onValueChange={setAmountRange}
                      onValueCommit={(value) => updateFilters({ amountRange: value as [number, number] })}
                      max={10000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(amountRange[0])}</span>
                    <span>{formatCurrency(amountRange[1])}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-muted-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-1">
          {filters.type.map((type) => (
            <Badge key={`type-${type}`} variant="secondary" className="text-xs">
              {typeOptions.find(t => t.value === type)?.label}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => toggleArrayFilter('type', type)}
              />
            </Badge>
          ))}
          {filters.status.map((status) => (
            <Badge key={`status-${status}`} variant="secondary" className="text-xs">
              {statusOptions.find(s => s.value === status)?.label}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => toggleArrayFilter('status', status)}
              />
            </Badge>
          ))}
          {filters.category.map((category) => (
            <Badge key={`category-${category}`} variant="secondary" className="text-xs">
              {category}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => toggleArrayFilter('category', category)}
              />
            </Badge>
          ))}
          {filters.paymentMethod.map((method) => (
            <Badge key={`payment-${method}`} variant="secondary" className="text-xs">
              {method}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => toggleArrayFilter('paymentMethod', method)}
              />
            </Badge>
          ))}
          {filters.dateRange !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {dateRangeOptions.find(d => d.value === filters.dateRange)?.label}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => updateFilters({ dateRange: 'all' })}
              />
            </Badge>
          )}
          {(filters.amountRange[0] > 0 || filters.amountRange[1] < 10000) && (
            <Badge variant="secondary" className="text-xs">
              {formatCurrency(filters.amountRange[0])} - {formatCurrency(filters.amountRange[1])}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => updateFilters({ amountRange: [0, 10000] })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};